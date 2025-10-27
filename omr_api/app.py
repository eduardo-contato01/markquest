# app.py — FastAPI + OpenCV OMR (versão iniciante, grid-based)
# Run: uvicorn app:app --reload
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import numpy as np
import cv2
import io
import json

app = FastAPI(title="OMR API (v2)", version="0.2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # em produção restrinja ao seu domínio
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- utils
def read_image_bytes_to_cv2(img_bytes: bytes):
    nparr = np.frombuffer(img_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    return img

def auto_find_sheet(img):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    blur = cv2.GaussianBlur(gray, (5,5), 0)
    edged = cv2.Canny(blur, 75, 200)
    contours,_ = cv2.findContours(edged.copy(), cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)
    contours = sorted(contours, key=cv2.contourArea, reverse=True)[:10]
    for c in contours:
        peri = cv2.arcLength(c, True)
        approx = cv2.approxPolyDP(c, 0.02 * peri, True)
        if len(approx) == 4:
            pts = approx.reshape(4,2)
            return order_points(pts)
    return None

def order_points(pts):
    # returns pts in [tl,tr,br,bl]
    rect = np.zeros((4,2), dtype="float32")
    s = pts.sum(axis=1)
    rect[0] = pts[np.argmin(s)]
    rect[2] = pts[np.argmax(s)]
    diff = np.diff(pts, axis=1)
    rect[1] = pts[np.argmin(diff)]
    rect[3] = pts[np.argmax(diff)]
    return rect

def four_point_transform(image, pts):
    rect = pts.astype("float32")
    (tl, tr, br, bl) = rect
    widthA = np.linalg.norm(br - bl)
    widthB = np.linalg.norm(tr - tl)
    maxWidth = max(int(widthA), int(widthB))
    heightA = np.linalg.norm(tr - br)
    heightB = np.linalg.norm(tl - bl)
    maxHeight = max(int(heightA), int(heightB))
    dst = np.array([[0,0],[maxWidth-1,0],[maxWidth-1,maxHeight-1],[0,maxHeight-1]], dtype="float32")
    M = cv2.getPerspectiveTransform(rect, dst)
    warped = cv2.warpPerspective(image, M, (maxWidth, maxHeight))
    return warped

# --- OMR core (grid, template in ratios)
def omr_from_image(img, template):
    """
    template = {
      "grid": {"rows": 75, "cols": 5, "x":0.08, "y":0.18, "w":0.84, "h":0.70}
      # x,y,w,h are ratios relative to warped image width/height
    }
    """
    # Standardize size (helps with consistent cell sizes)
    TARGET_W = 1200
    h, w = img.shape[:2]
    scale = TARGET_W / float(w)
    warped = cv2.resize(img, (TARGET_W, int(h*scale)))
    H, W = warped.shape[:2]

    # Convert to gray + adaptive threshold
    gray = cv2.cvtColor(warped, cv2.COLOR_BGR2GRAY)
    blur = cv2.GaussianBlur(gray, (5,5), 0)
    th = cv2.adaptiveThreshold(blur,255,cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY_INV,25,10)

    # crop grid region using template ratios
    g = template["grid"]
    x = int(g["x"] * W)
    y = int(g["y"] * H)
    gw = int(g["w"] * W)
    gh = int(g["h"] * H)
    grid_img = th[y:y+gh, x:x+gw]

    rows = g["rows"]
    cols = g["cols"]

    # compute cell size (assume one question per row, options in columns)
    cell_h = gh // rows
    cell_w = gw // cols

    results = []
    for r in range(rows):
        # for each question row, sample each option column
        filled_ratios = []
        for c in range(cols):
            cx1 = c * cell_w
            cy1 = r * cell_h
            cell = grid_img[cy1:cy1+cell_h, cx1:cx1+cell_w]
            # focus on central area to avoid borders
            h_c, w_c = cell.shape[:2]
            pad_h = int(h_c * 0.18)
            pad_w = int(w_c * 0.10)
            roi = cell[pad_h:h_c-pad_h, pad_w:w_c-pad_w]
            if roi.size == 0:
                filled = 0.0
            else:
                filled = cv2.countNonZero(roi) / float(roi.size)
            filled_ratios.append(filled)
        # decide best option
        max_idx = int(np.argmax(filled_ratios))
        max_val = float(filled_ratios[max_idx])
        # compute confidence as relative gap to second best
        sorted_vals = sorted(filled_ratios, reverse=True)
        second = float(sorted_vals[1]) if len(sorted_vals) > 1 else 0.0
        confidence = max(0.0, min(1.0, (max_val - second) / (max_val + 1e-6)))
        # threshold: require a minimum fill to be considered marked
        MIN_FILL_THRESHOLD = template.get("min_fill", 0.08)  # tweak per template
        option_letter = None
        marked = max_val >= MIN_FILL_THRESHOLD
        if marked:
            option_letter = "ABCDE"[max_idx] if cols <= 5 else str(max_idx)
        results.append({
            "question": r+1,
            "marked": bool(marked),
            "option_index": int(max_idx) if marked else None,
            "option": option_letter,
            "filled_ratio": round(max_val, 4),
            "confidence": round(confidence, 3)
        })
    return results

# --- load a default template (can be replaced by file/db)
DEFAULT_TEMPLATE = {
  "grid": {"rows": 75, "cols": 5, "x":0.06, "y":0.18, "w":0.88, "h":0.68},
  "min_fill": 0.08
}

@app.get("/health")
def health():
    return {"status":"ok","service":"omr-api-v2","version":"0.2.0"}

import fitz  # PyMuPDF
import base64

async def uploadfile_to_cv2_image(file: UploadFile):
    data = await file.read()
    if file.content_type == "application/pdf" or file.filename.lower().endswith(".pdf"):
        doc = fitz.open(stream=data, filetype="pdf")
        if doc.page_count == 0:
            raise HTTPException(status_code=400, detail="PDF sem páginas.")
        page = doc.load_page(0)
        pix = page.get_pixmap(dpi=300, alpha=False)
        img = np.frombuffer(pix.samples, dtype=np.uint8).reshape(pix.height, pix.width, pix.n)
        img = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)
        return img
    else:
        arr = np.frombuffer(data, np.uint8)
        img = cv2.imdecode(arr, cv2.IMREAD_COLOR)
        return img

import traceback
from fastapi import HTTPException

@app.post("/scan")
async def scan(file: UploadFile = File(...), template_name: Optional[str]=None):
    try:
        img = await uploadfile_to_cv2_image(file)
        if img is None:
            raise ValueError("Invalid image")

        pts = auto_find_sheet(img)
        warped = four_point_transform(img, pts) if pts is not None else img

        template = DEFAULT_TEMPLATE
        answers = omr_from_image(warped, template)

        _, preview_jpg = cv2.imencode(".jpg", warped)
        preview_b64 = base64.b64encode(preview_jpg.tobytes()).decode("ascii")

        H, W = warped.shape[:2]
        warp_pts_norm = None
        if pts is not None:
            warp_pts_norm = [(float(x)/W, float(y)/H) for (x, y) in pts.tolist()]

        _, preview_jpg = cv2.imencode(".jpg", warped)
        preview_b64 = base64.b64encode(preview_jpg.tobytes()).decode("ascii")

        return {
            "status":"ok",
            "meta":{
                "filename": file.filename,
                "template": "default",
                "questions": template["grid"]["rows"],
                "options_per_question": template["grid"]["cols"]},
                "warped_size": [W, H],
                "warp_pts_norm": warp_pts_norm,
                "answers": answers,
                "preview_image_base64": preview_b64
            }
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=400, detail=f"{type(e).__name__}: {e}")

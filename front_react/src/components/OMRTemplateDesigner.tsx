import React, { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Download, Copy, Ruler, Grid3X3, LayoutGrid, QrCode, FileJson, Printer } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";

// --- Helper types (pure front-end; your API will define its own Pydantic models) ---
type Block = {
  x: number; // normalized 0..1
  y: number; // normalized 0..1
  w: number; // normalized 0..1
  h: number; // normalized 0..1
  rows: number;
  cols: number; // options per question (e.g., 5 for A-E)
  start_q: number;
};

// Page presets for preview (aspect ratio only; printing handled by your site)
const PAGE_SIZES = {
  A4: { w: 210, h: 297 },
  Letter: { w: 216, h: 279 },
};

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

// Small utility to trigger file download
function download(filename: string, data: string, mime = "application/json") {
  const blob = new Blob([data], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// Draw corner marks (registration markers)
const CornerMark: React.FC<{ pos: "tl" | "tr" | "bl" | "br" }> = ({ pos }) => {
  const base = "absolute w-8 h-8";
  const common = "border-[3px] border-black";
  const map: Record<string, string> = {
    tl: `${base} left-2 top-2 border-r-0 border-b-0 ${common}`,
    tr: `${base} right-2 top-2 border-l-0 border-b-0 ${common}`,
    bl: `${base} left-2 bottom-2 border-r-0 border-t-0 ${common}`,
    br: `${base} right-2 bottom-2 border-l-0 border-t-0 ${common}`,
  };
  return <div className={map[pos]} />;
};

// Draw a circle bubble (SVG so it scales crisply)
const Bubble: React.FC<{ sizePx: number }> = ({ sizePx }) => (
  <svg width={sizePx} height={sizePx} viewBox={`0 0 ${sizePx} ${sizePx}`}> 
    <circle cx={sizePx / 2} cy={sizePx / 2} r={(sizePx / 2) - 1} stroke="black" strokeWidth="1.5" fill="white" />
  </svg>
);

// Compute even split of questions across N columns (blocks)
function splitQuestions(total: number, columns: number) {
  const perCol = Math.floor(total / columns);
  const remainder = total % columns;
  const arr: number[] = new Array(columns).fill(perCol);
  for (let i = 0; i < remainder; i++) arr[i] += 1;
  return arr; // e.g., 75 -> [25,25,25] for 3 columns
}

export default function OMRTemplateDesigner() {
  // --- Controls ---
  const [templateId, setTemplateId] = useState("schoolA_math_v1");
  const [version, setVersion] = useState(1);
  const [pageSize, setPageSize] = useState<keyof typeof PAGE_SIZES>("A4");

  const [numQuestions, setNumQuestions] = useState(75);
  const [options, setOptions] = useState("ABCDE");
  const [columns, setColumns] = useState(2);

  // Margins and bubble spec are normalized 0..1 relative to page width/height
  const [marginTop, setMarginTop] = useState(0.10);
  const [marginRight, setMarginRight] = useState(0.06);
  const [marginBottom, setMarginBottom] = useState(0.08);
  const [marginLeft, setMarginLeft] = useState(0.06);

  const [bubbleDiameter, setBubbleDiameter] = useState(0.012); // width-normalized
  const [bubbleSpacing, setBubbleSpacing] = useState(0.008); // width-normalized

  const previewRef = useRef<HTMLDivElement>(null);

  const optsArray = useMemo(() => options.split("").filter(Boolean), [options]);
  const page = PAGE_SIZES[pageSize];

  // --- Compute blocks layout ---
  const blocks: Block[] = useMemo(() => {
    const innerX = marginLeft;
    const innerY = marginTop;
    const innerW = clamp01(1 - marginLeft - marginRight);
    const innerH = clamp01(1 - marginTop - marginBottom);

    const split = splitQuestions(numQuestions, Math.max(1, columns));

    let cursorQ = 1;
    const list: Block[] = split.map((qty, cIdx) => {
      const w = innerW / columns;
      const h = innerH; // same height for all columns
      const x = innerX + cIdx * w;
      const y = innerY;
      const start_q = cursorQ;
      cursorQ += qty;
      const rows = qty; // one row per question
      const cols = optsArray.length; // options per row
      return { x, y, w, h, rows, cols, start_q };
    });
    return list;
  }, [marginLeft, marginRight, marginTop, marginBottom, numQuestions, columns, optsArray.length]);

  // --- Build exportable template JSON ---
  const templateJSON = useMemo(() => {
    return {
      id: templateId,
      version,
      page_size: pageSize,
      markers: "corners",
      options: optsArray, // e.g., ["A","B","C","D","E"]
      blocks: blocks.map((b) => ({ ...b })),
      bubbles: { shape: "circle", diameter: bubbleDiameter, spacing: bubbleSpacing },
      meta: { generatedAt: new Date().toISOString() },
    };
  }, [templateId, version, pageSize, blocks, bubbleDiameter, bubbleSpacing, optsArray]);

  // --- Export handlers ---
  const handleDownloadJSON = () => {
    const pretty = JSON.stringify(templateJSON, null, 2);
    download(`${templateId}_v${version}.template.json`, pretty);
  };

  const handleCopyJSON = async () => {
    await navigator.clipboard.writeText(JSON.stringify(templateJSON, null, 2));
    alert("Template JSON copiado para a área de transferência.");
  };

  const handleDownloadPNG = async () => {
    // Simple rasterization of the preview (fallback). For production, consider html2canvas or a print stylesheet
    if (!previewRef.current) return;
    const el = previewRef.current as HTMLDivElement;
    const blob = await (await fetch("data:image/svg+xml;utf8," + encodeURIComponent(el.outerHTML))).blob().catch(() => null);
    if (!blob) {
      window.print();
      return;
    }
    download(`${templateId}_preview.svg`, await blob.text(), "image/svg+xml");
  };

  // --- Derived values for preview ---
  const aspect = page.h / page.w; // height / width
  const showWidth = 840; // px
  const showHeight = Math.round(showWidth * aspect);

  // Size of bubble in pixels relative to preview width
  const px = (norm: number) => norm * showWidth; // normalize against width for consistency
  const bubblePx = Math.max(6, Math.round(px(bubbleDiameter)));
  const gapPx = Math.max(4, Math.round(px(bubbleSpacing)));

  return (
    <div className="w-full mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">OMR Template Designer</h1>
          <p className="text-sm text-gray-600">Gere cartões-resposta dinâmicos + template.json para sua API</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleDownloadJSON} className="inline-flex items-center gap-2 px-3 py-2 rounded-2xl shadow text-sm border">
            <FileJson className="w-4 h-4" /> Exportar JSON
          </button>
          <button onClick={handleCopyJSON} className="inline-flex items-center gap-2 px-3 py-2 rounded-2xl shadow text-sm border">
            <Copy className="w-4 h-4" /> Copiar JSON
          </button>
          <button onClick={handleDownloadPNG} className="inline-flex items-center gap-2 px-3 py-2 rounded-2xl shadow text-sm border">
            <Download className="w-4 h-4" /> Baixar preview
          </button>
          <button onClick={() => window.print()} className="inline-flex items-center gap-2 px-3 py-2 rounded-2xl shadow text-sm border">
            <Printer className="w-4 h-4" /> Imprimir
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl border shadow-sm space-y-3">
          <h2 className="font-semibold flex items-center gap-2"><LayoutGrid className="w-4 h-4"/> Template</h2>
          <label className="text-sm">Template ID
            <input value={templateId} onChange={(e)=>setTemplateId(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-xl border"/>
          </label>
          <label className="text-sm">Versão
            <input type="number" min={1} value={version} onChange={(e)=>setVersion(parseInt(e.target.value || "1"))} className="w-full mt-1 px-3 py-2 rounded-xl border"/>
          </label>
          <label className="text-sm">Tamanho da página
            <select value={pageSize} onChange={(e)=>setPageSize(e.target.value as any)} className="w-full mt-1 px-3 py-2 rounded-xl border">
              <option value="A4">A4</option>
              <option value="Letter">Letter</option>
            </select>
          </label>
        </div>

        <div className="p-4 rounded-2xl border shadow-sm space-y-3">
          <h2 className="font-semibold flex items-center gap-2"><Grid3X3 className="w-4 h-4"/> Questões</h2>
          <label className="text-sm">Nº de questões
            <input type="number" min={1} value={numQuestions} onChange={(e)=>setNumQuestions(parseInt(e.target.value || "1"))} className="w-full mt-1 px-3 py-2 rounded-xl border"/>
          </label>
          <label className="text-sm">Opções (ex: ABCDE)
            <input value={options} onChange={(e)=>setOptions(e.target.value.toUpperCase())} className="w-full mt-1 px-3 py-2 rounded-xl border"/>
          </label>
          <label className="text-sm">Colunas (blocos)
            <input type="number" min={1} max={4} value={columns} onChange={(e)=>setColumns(Math.max(1, Math.min(4, parseInt(e.target.value || "1"))))} className="w-full mt-1 px-3 py-2 rounded-xl border"/>
          </label>
        </div>

        <div className="p-4 rounded-2xl border shadow-sm space-y-3">
          <h2 className="font-semibold flex items-center gap-2"><Ruler className="w-4 h-4"/> Layout</h2>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <label>Margem Top
              <input type="number" step={0.005} min={0} max={0.25} value={marginTop} onChange={(e)=>setMarginTop(clamp01(parseFloat(e.target.value || "0")))} className="w-full mt-1 px-3 py-2 rounded-xl border"/>
            </label>
            <label>Margem Bottom
              <input type="number" step={0.005} min={0} max={0.25} value={marginBottom} onChange={(e)=>setMarginBottom(clamp01(parseFloat(e.target.value || "0")))} className="w-full mt-1 px-3 py-2 rounded-xl border"/>
            </label>
            <label>Margem Left
              <input type="number" step={0.005} min={0} max={0.25} value={marginLeft} onChange={(e)=>setMarginLeft(clamp01(parseFloat(e.target.value || "0")))} className="w-full mt-1 px-3 py-2 rounded-xl border"/>
            </label>
            <label>Margem Right
              <input type="number" step={0.005} min={0} max={0.25} value={marginRight} onChange={(e)=>setMarginRight(clamp01(parseFloat(e.target.value || "0")))} className="w-full mt-1 px-3 py-2 rounded-xl border"/>
            </label>
            <label>Diâmetro bolha (norm.)
              <input type="number" step={0.001} min={0.005} max={0.03} value={bubbleDiameter} onChange={(e)=>setBubbleDiameter(clamp01(parseFloat(e.target.value || "0.01")))} className="w-full mt-1 px-3 py-2 rounded-xl border"/>
            </label>
            <label>Espaçamento (norm.)
              <input type="number" step={0.001} min={0.003} max={0.04} value={bubbleSpacing} onChange={(e)=>setBubbleSpacing(clamp01(parseFloat(e.target.value || "0.008")))} className="w-full mt-1 px-3 py-2 rounded-xl border"/>
            </label>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h3 className="font-semibold mb-2">Preview de impressão</h3>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="rounded-2xl border shadow-sm bg-white p-4">
            <div className="mx-auto relative bg-white border" style={{ width: showWidth, height: showHeight }}>
              {/* Page frame for export (DOM used later for printing/SVG) */}
              <div ref={previewRef} className="relative w-full h-full">
                {/* Corner marks */}
                <CornerMark pos="tl" />
                <CornerMark pos="tr" />
                <CornerMark pos="bl" />
                <CornerMark pos="br" />

                {/* QR with id@version */}
                <div className="absolute right-3 top-3 flex items-center gap-2">
                  <QRCodeCanvas value={`${templateId}@v${version}`} size={64} includeMargin={false} />
                  <div className="text-xs">
                    <div className="font-semibold flex items-center gap-1"><QrCode className="w-3 h-3"/> {templateId}</div>
                    <div>v{version} · {pageSize}</div>
                  </div>
                </div>

                {/* Blocks */}
                {blocks.map((b, i) => {
                  const left = b.x * showWidth;
                  const top = b.y * showHeight;
                  const width = b.w * showWidth;
                  const height = b.h * showHeight;

                  // compute cell sizes
                  const rowGap = gapPx; // vertical gap between questions
                  const colGap = gapPx; // horizontal gap between bubbles
                  const labelW = 28; // px for question number

                  const contentW = width - 16; // inner padding
                  const contentH = height - 16;

                  const startX = left + 8;
                  const startY = top + 8;

                  const rowH = Math.max(bubblePx, Math.floor((contentH - (b.rows - 1) * rowGap) / b.rows));
                  const colW = Math.max(bubblePx, Math.floor((contentW - labelW - (b.cols - 1) * colGap) / b.cols));

                  return (
                    <div key={i} className="absolute rounded-md border-2 border-dashed" style={{ left, top, width, height }}>
                      <div className="absolute text-[10px] left-1 top-1 bg-white/80 px-1 rounded">{`Q${b.start_q}…Q${b.start_q + b.rows - 1}`}</div>
                      {/* Grid of rows */}
                      {Array.from({ length: b.rows }).map((_, r) => {
                        const y = startY + r * (rowH + rowGap);
                        return (
                          <div key={r} className="absolute flex items-center" style={{ left: startX, top: y, height: rowH }}>
                            {/* Question number */}
                            <div className="text-xs w-7 text-right pr-1 select-none">{b.start_q + r}</div>
                            {/* Bubbles */}
                            {Array.from({ length: b.cols }).map((__, c) => {
                              const x = startX + labelW + c * (colW + colGap);
                              return (
                                <div key={c} className="absolute" style={{ left: x, width: colW, height: rowH }}>
                                  <Bubble sizePx={Math.min(colW, rowH)} />
                                  <div className="text-[10px] text-center mt-0.5 select-none">{optsArray[c]}</div>
                                </div>
                              );
                            })}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Live JSON */}
        <div>
          <h3 className="font-semibold mb-2">Template JSON (ao vivo)</h3>
          <div className="rounded-2xl border shadow-sm bg-gray-50 overflow-hidden">
            <pre className="p-4 text-xs overflow-auto max-h-[520px]">{JSON.stringify(templateJSON, null, 2)}</pre>
          </div>
        </div>
      </div>

      {/* Footer note */}
      <p className="text-xs text-gray-500">⚠️ Observação: as medidas (diâmetro/spacing) são normalizadas pela largura da página para facilitar a configuração. No backend, converta para pixels após o warp/perspective usando o bounding box normalizado do bloco.</p>
    </div>
  );
}

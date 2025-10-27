export function drawOverlay(imgEl, apiAnswers, canvasId = 'result-overlay') {
    const TEMPLATE = { rows: 75, cols: 5, x: 0.06, y: 0.18, w: 0.88, h: 0.68 };
    const canvas = document.getElementById(canvasId);
    if (!canvas || !imgEl) return;

    const dispW = imgEl.clientWidth || imgEl.getBoundingClientRect().width;
    const dispH = imgEl.clientHeight || imgEl.getBoundingClientRect().height;
    canvas.width = dispW;
    canvas.height = dispH;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1) Cantos detectados (debug)
    const meta = (window.__lastScanMeta || {});
    if (meta.warp_pts_norm && Array.isArray(meta.warp_pts_norm)) {
        ctx.strokeStyle = 'rgba(255, 120, 0, 0.9)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        meta.warp_pts_norm.forEach((p, i) => {
        const x = p[0] * dispW;
        const y = p[1] * dispH;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        ctx.fillStyle = 'rgba(255,120,0,0.9)';
        ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2); ctx.fill();
        });
        ctx.closePath();
        ctx.stroke();

          }

    // 2) Área do grid (TEMPLATE)
    const gx = TEMPLATE.x * dispW;
    const gy = TEMPLATE.y * dispH;
    const gw = TEMPLATE.w * dispW;
    const gh = TEMPLATE.h * dispH;

    ctx.strokeStyle = 'rgba(0, 160, 120, 0.9)';
    ctx.lineWidth = 2;
    ctx.strokeRect(gx, gy, gw, gh);

    const answers = Array.isArray(apiAnswers) ? apiAnswers : [];
    if (!answers.length) return;

    const cellH = gh / TEMPLATE.rows;
    const cellW = gw / TEMPLATE.cols;

    answers.forEach((a, i) => {
        const r = (a.question ? a.question - 1 : i);
        const optIdx = a.option ? 'ABCDE'.indexOf(a.option) : -1;

        ctx.strokeStyle = 'rgba(0,0,0,0.08)';
        ctx.strokeRect(gx, gy + r * cellH, gw, cellH);

        if (optIdx >= 0 && a.marked) {
        const x = gx + optIdx * cellW;
        const y = gy + r * cellH;
        ctx.fillStyle = 'rgba(0, 160, 255, 0.25)';
        ctx.fillRect(x, y, cellW, cellH);
        }
    });
}
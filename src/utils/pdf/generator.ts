import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import type { ProjectData, PrintConfig } from '@/types/project';
import { loadImage } from './imageLoader';
import { drawCropMarks } from './cropMarks';

// ── Constants ────────────────────────────────────────────────────────────────

const PAPER_SIZES: Record<string, { w: number; h: number }> = {
  A4:     { w: 210, h: 297 },
  A3:     { w: 297, h: 420 },
  SRA3:   { w: 320, h: 450 },
  Custom: { w: 210, h: 297 },
};

// 300 DPI ≈ 11.811 pixels per mm
const DPI_SCALE = 11.811;

// ── Main Generator ────────────────────────────────────────────────────────────

/**
 * Generates a professional, print-ready PDF from project data and config.
 * Renders each dataset row onto the design template at 300 DPI with
 * optional bleed, crop marks, and N-Up imposition layout.
 *
 * @param data       - Full project data (design, dataset, mapping)
 * @param config     - Print configuration (paper size, dimensions, bleed, etc.)
 * @param onProgress - Callback to report progress (0–100)
 */
export async function generateProfessionalPDF(
  data: ProjectData,
  config: PrintConfig,
  onProgress: (p: number) => void,
): Promise<void> {
  const { dataset, mapping, design } = data;
  if (!dataset || !mapping || !design?.preview) return;

  const paperDim = PAPER_SIZES[config.paperSize] ?? PAPER_SIZES.A4;
  const paperW = config.orientation === 'p' ? paperDim.w : paperDim.h;
  const paperH = config.orientation === 'p' ? paperDim.h : paperDim.w;

  const pdf = new jsPDF({
    orientation: config.orientation,
    unit: 'mm',
    format: [paperW, paperH],
  });

  // 1. Load background image once
  const bgImg = await loadImage(design.preview);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const designW_mm = config.widthCm * 10;
  const designH_mm = config.heightCm * 10;
  const bleed_mm = config.bleedMm;

  // Canvas size includes bleed on all sides
  canvas.width  = Math.round((designW_mm + 2 * bleed_mm) * DPI_SCALE);
  canvas.height = Math.round((designH_mm + 2 * bleed_mm) * DPI_SCALE);

  const totalRows = dataset.rows.length;

  // Build a fast header → column-index lookup
  const headerIndex: Record<string, number> = {};
  dataset.headers.forEach((h, i) => { headerIndex[h] = i; });

  // 2. Imposition layout calculation
  const margin_mm    = 10; // Safety margin for printer
  const stepX        = designW_mm + (config.nUp ? 2 : 20);
  const stepY        = designH_mm + (config.nUp ? 2 : 20);
  const cols         = config.nUp ? Math.floor((paperW - 2 * margin_mm) / stepX) : 1;
  const rowsPerPage  = config.nUp ? Math.floor((paperH - 2 * margin_mm) / stepY) : 1;
  const itemsPerPage = cols * rowsPerPage;

  // 3. Render each row
  for (let i = 0; i < totalRows; i++) {
    const row = dataset.rows[i];
    const itemInPageIndex = i % itemsPerPage;

    if (i > 0 && itemInPageIndex === 0) {
      pdf.addPage();
    }

    const colIdx = itemInPageIndex % cols;
    const rowIdx = Math.floor(itemInPageIndex / cols);

    // Center the grid on the paper
    const gridW  = cols * stepX;
    const gridH  = rowsPerPage * stepY;
    const startX = (paperW - gridW) / 2 + colIdx * stepX + stepX / 2 - designW_mm / 2;
    const startY = (paperH - gridH) / 2 + rowIdx * stepY + stepY / 2 - designH_mm / 2;

    // A. Render high-res design to canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

    for (const field of mapping) {
      const val    = String(row[headerIndex[field.column]] ?? '');
      const scaleX = canvas.width  / (bgImg.naturalWidth  || 1);
      const scaleY = canvas.height / (bgImg.naturalHeight || 1);

      const fx = field.x * scaleX;
      const fy = field.y * scaleY;
      const fw = field.width  * scaleX;
      const fh = field.height * scaleY;

      if (field.type === 'qrcode') {
        try {
          const qrDataUrl = await QRCode.toDataURL(val, {
            margin: 1,
            width: Math.min(fw, fh),
            color: { dark: '#000000', light: '#ffffff00' },
          });
          const qrImg  = await loadImage(qrDataUrl);
          const qrSize = Math.min(fw, fh);
          const qrX    = fx + (fw - qrSize) / 2;
          const qrY    = fy + (fh - qrSize) / 2;
          ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
        } catch (err) {
          console.error('QR generation failed for value:', val, err);
        }
      } else {
        ctx.fillStyle    = field.color;
        ctx.font         = `bold ${Math.round(field.fontSize * scaleX)}px ${field.fontFamily}`;
        ctx.textAlign    = field.align;
        ctx.textBaseline = 'middle';

        let drawX = fx;
        if (field.align === 'center') drawX = fx + fw / 2;
        if (field.align === 'right')  drawX = fx + fw;

        ctx.fillText(val, drawX, fy + fh / 2, fw);
      }
    }

    // B. Add rendered canvas to PDF
    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
    pdf.addImage(
      dataUrl,
      'JPEG',
      startX - bleed_mm,
      startY - bleed_mm,
      designW_mm + 2 * bleed_mm,
      designH_mm + 2 * bleed_mm,
    );

    // C. Draw crop marks if enabled
    if (config.showCropMarks) {
      drawCropMarks(pdf, startX, startY, designW_mm, designH_mm, bleed_mm);
    }

    onProgress(((i + 1) / totalRows) * 100);

    // Yield to keep UI responsive every 5 rows
    if (i % 5 === 0) await new Promise<void>((r) => setTimeout(r, 10));
  }

  pdf.save(`PrintX_Export_${Date.now()}.pdf`);
}

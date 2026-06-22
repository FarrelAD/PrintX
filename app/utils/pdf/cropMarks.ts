import { jsPDF } from 'jspdf';

/**
 * Draws professional crop marks around a design element on the PDF.
 *
 * @param pdf       - The jsPDF instance to draw on
 * @param x         - Left edge of the design (mm)
 * @param y         - Top edge of the design (mm)
 * @param w         - Width of the design (mm)
 * @param h         - Height of the design (mm)
 * @param bleed     - Bleed margin in mm
 */
export function drawCropMarks(
  pdf: jsPDF,
  x: number,
  y: number,
  w: number,
  h: number,
  bleed: number,
): void {
  pdf.setLineWidth(0.1);
  pdf.setDrawColor(0, 0, 0);
  const len = 5; // length of marks in mm
  const gap = 2; // gap from trim line in mm

  // Horizontal marks
  pdf.line(x - bleed - len, y, x - gap, y); // Top left
  pdf.line(x + w + gap, y, x + w + bleed + len, y); // Top right
  pdf.line(x - bleed - len, y + h, x - gap, y + h); // Bottom left
  pdf.line(x + w + gap, y + h, x + w + bleed + len, y + h); // Bottom right

  // Vertical marks
  pdf.line(x, y - bleed - len, x, y - gap); // Top left
  pdf.line(x, y + h + gap, x, y + h + bleed + len); // Bottom left
  pdf.line(x + w, y - bleed - len, x + w, y - gap); // Top right
  pdf.line(x + w, y + h + gap, x + w, y + h + bleed + len); // Bottom right
}

import { Stage, Layer, Image as KonvaImage, Rect as KonvaRect, Text } from 'react-konva';
import type { ProjectData } from '@/types/project';
import { QRNode } from './QRNode';

export function RowPreview({
  rowIndex,
  width = 280,
  data,
  bgImage,
}: {
  rowIndex: number;
  width?: number;
  data: ProjectData;
  bgImage: HTMLImageElement | null;
}) {
  const { design, dataset, mapping } = data;
  if (!design?.preview || !dataset || !mapping) return null;

  const naturalW = bgImage?.naturalWidth ?? 1;
  const naturalH = bgImage?.naturalHeight ?? 1;
  const ratio = naturalH / naturalW;
  const previewH = Math.round(width * ratio);

  const scaleX = width / naturalW;
  const scaleY = previewH / naturalH;

  const row = dataset.rows[rowIndex] ?? [];
  const headerIndex: Record<string, number> = {};
  dataset.headers.forEach((h, i) => { headerIndex[h] = i; });

  return (
    <div className="flex flex-col gap-1 items-center">
      <div
        className="border border-outline-variant overflow-hidden bg-surface-container-low"
        style={{ width: width, height: previewH }}
      >
        <Stage width={width} height={previewH} listening={false}>
          <Layer>
            {/* Background Rect */}
            <KonvaRect
              x={0}
              y={0}
              width={width}
              height={previewH}
              fill={data.editorSettings?.canvasBgColor === 'transparent' ? '#ffffff' : (data.editorSettings?.canvasBgColor ?? '#ffffff')}
            />

            {bgImage && (data.editorSettings?.showDesign ?? true) && (
              <KonvaImage
                image={bgImage}
                x={0}
                y={0}
                width={width}
                height={previewH}
                listening={false}
              />
            )}
            {mapping.map((field) => {
              const colIdx = headerIndex[field.column] ?? -1;
              const value = colIdx >= 0 && row[colIdx] !== undefined
                ? String(row[colIdx])
                : `[${field.column}]`;

              if (field.type === 'qrcode') {
                return (
                  <QRNode
                    key={field.id}
                    value={value}
                    x={field.x * scaleX}
                    y={field.y * scaleY}
                    width={field.width * scaleX}
                    height={field.height * scaleY}
                  />
                );
              }

              return (
                <Text
                  key={field.id}
                  x={field.x * scaleX}
                  y={field.y * scaleY}
                  width={field.width * scaleX}
                  height={field.height * scaleY}
                  text={value}
                  fontSize={field.fontSize * Math.min(scaleX, scaleY)}
                  fontFamily={field.fontFamily}
                  fontStyle={field.fontWeight === 'bold' ? 'bold' : 'normal'}
                  fill={field.color}
                  align={field.align}
                  verticalAlign={field.verticalAlign || 'middle'}
                  wrap={field.wrap ? 'word' : 'none'}
                  ellipsis={false}
                  listening={false}
                />
              );
            })}
          </Layer>
        </Stage>
      </div>
      <span className="text-[9px] font-bold uppercase tracking-widest text-secondary">
        Data #{rowIndex + 1}
      </span>
    </div>
  );
}

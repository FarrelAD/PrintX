import { useRef } from 'react';
import { Text, Rect, Group } from 'react-konva';
import type Konva from 'konva';
import type { MappingField } from '@/types/project';

export function FieldNode({
  field,
  scale,
  isSelected,
  onSelect,
  onChange,
}: {
  field: MappingField;
  scale: number;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (patch: Partial<MappingField>) => void;
}) {
  const groupRef = useRef<Konva.Group>(null);

  // Sync size back after transformer resize
  const handleTransformEnd = () => {
    const node = groupRef.current;
    if (!node) return;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    node.scaleX(1);
    node.scaleY(1);
    onChange({
      x: node.x() / scale,
      y: node.y() / scale,
      width: Math.max(40, (node.width() * scaleX) / scale),
      height: Math.max(20, (node.height() * scaleY) / scale),
    });
  };

  const label = `{{${field.column}}}`;

  return (
    <Group
      ref={groupRef}
      id={`field-${field.id}`}
      x={field.x * scale}
      y={field.y * scale}
      width={field.width * scale}
      height={field.height * scale}
      draggable
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={(e: { target: Konva.Node }) => {
        onChange({ x: e.target.x() / scale, y: e.target.y() / scale });
      }}
      onTransformEnd={handleTransformEnd}
    >
      {/* Background rect */}
      <Rect
        x={0}
        y={0}
        width={field.width * scale}
        height={field.height * scale}
        fill={isSelected ? 'rgba(0,0,0,0.08)' : 'rgba(0,0,0,0.04)'}
        stroke={isSelected ? '#000000' : 'rgba(0,0,0,0.3)'}
        strokeWidth={isSelected ? 1.5 : 1}
        dash={isSelected ? undefined : [4, 3]}
      />
      {/* Label text */}
      {field.type === 'qrcode' ? (
        <Group x={4 * scale} y={4 * scale}>
          <Rect
            width={(field.width - 8) * scale}
            height={(field.height - 8) * scale}
            fill="#f3f4f6"
            stroke="#d1d5db"
            strokeWidth={1}
          />
          <Text
            width={(field.width - 8) * scale}
            height={(field.height - 8) * scale}
            text="QR CODE"
            fontSize={Math.min(12 * scale, (field.height - 16) * scale)}
            fontFamily="Inter"
            fontStyle="bold"
            fill="#6b7280"
            align="center"
            verticalAlign="middle"
          />
          <Text
            x={(field.width - 24) * scale}
            y={(field.height - 24) * scale}
            text="qr_code_2"
            fontFamily="Material Symbols Outlined"
            fontSize={16 * scale}
            fill="#6b7280"
          />
        </Group>
      ) : (
        <Text
          x={4 * scale}
          y={4 * scale}
          width={(field.width - 8) * scale}
          height={(field.height - 8) * scale}
          text={label}
          fontSize={field.fontSize * scale}
          fontFamily={field.fontFamily}
          fill={field.color}
          align={field.align}
          verticalAlign="middle"
          ellipsis
          wrap="none"
          listening={false}
        />
      )}
    </Group>
  );
}

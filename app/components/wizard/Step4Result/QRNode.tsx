import { useState, useEffect } from 'react';
import { Text, Rect, Group, Image as KonvaImage } from 'react-konva';
import QRCode from 'qrcode';

export function QRNode({ value, x, y, width, height }: {
  value: string;
  x: number;
  y: number;
  width: number;
  height: number;
}) {
  const [qrImg, setQrImg] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    let isMounted = true;
    QRCode.toDataURL(value, {
      margin: 1,
      width: 128, // Low res for preview
      color: {
        dark: '#000000',
        light: '#ffffff00',
      }
    }).then(url => {
      if (!isMounted) return;
      const img = new Image();
      img.src = url;
      img.onload = () => {
        if (isMounted) setQrImg(img);
      };
    }).catch(err => console.error('QR Preview failed', err));

    return () => { isMounted = false; };
  }, [value]);

  const size = Math.min(width, height);
  const qrX = x + (width - size) / 2;
  const qrY = y + (height - size) / 2;

  if (!qrImg) {
    return (
      <Group x={x} y={y}>
        <Rect
          width={width}
          height={height}
          fill="#f3f4f6"
          stroke="#d1d5db"
          strokeWidth={1}
        />
        <Text
          width={width}
          height={height}
          text="..."
          align="center"
          verticalAlign="middle"
        />
      </Group>
    );
  }

  return (
    <KonvaImage
      image={qrImg}
      x={qrX}
      y={qrY}
      width={size}
      height={size}
      listening={false}
    />
  );
}

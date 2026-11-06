/**
 * Loads an image from a URL and returns a Promise that resolves
 * with the loaded HTMLImageElement.
 */
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous'; // Important for canvas
    img.src = src;
    img.onload = () => resolve(img);
    img.onerror = () =>
      reject(new Error(`Gagal memuat gambar: ${src.substring(0, 50)}...`));
  });
}

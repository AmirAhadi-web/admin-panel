/**
 * Client-side image helper for the settings avatar picker.
 *
 * Reading + resizing happens entirely in the browser; the resulting data URL
 * is small enough to persist in localStorage (demo-only storage).
 */

const AVATAR_SIZE = 160;
const MAX_SOURCE_BYTES = 8 * 1024 * 1024; // 8 MB

export async function fileToAvatarDataUrl(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please choose an image file (PNG or JPG).");
  }
  if (file.size > MAX_SOURCE_BYTES) {
    throw new Error("Image must be smaller than 8 MB.");
  }

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new Error("Couldn't read that image file.");
  }

  try {
    // Center-crop to a square, then scale down to the avatar size.
    const side = Math.min(bitmap.width, bitmap.height);
    const sx = Math.round((bitmap.width - side) / 2);
    const sy = Math.round((bitmap.height - side) / 2);

    const canvas = document.createElement("canvas");
    canvas.width = AVATAR_SIZE;
    canvas.height = AVATAR_SIZE;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Image processing is not supported in this browser.");
    }
    ctx.drawImage(
      bitmap,
      sx,
      sy,
      side,
      side,
      0,
      0,
      AVATAR_SIZE,
      AVATAR_SIZE,
    );

    const outputType = file.type === "image/png" ? "image/png" : "image/jpeg";
    return canvas.toDataURL(outputType, 0.85);
  } finally {
    bitmap.close();
  }
}

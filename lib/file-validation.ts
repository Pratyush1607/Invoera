export const MAX_UPLOAD_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const ALLOWED_UPLOAD_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/heic",
  "image/heif",
  "application/pdf",
];

export function validateUploadFile(file: File): string | null {
  if (file.size <= 0) {
    return "That file is empty.";
  }
  if (file.size > MAX_UPLOAD_FILE_SIZE) {
    return "File is too large (max 10MB).";
  }
  if (!ALLOWED_UPLOAD_MIME_TYPES.includes(file.type)) {
    return "Unsupported file type. Upload a PDF or image (JPG, PNG, WEBP, GIF, HEIC).";
  }
  return null;
}

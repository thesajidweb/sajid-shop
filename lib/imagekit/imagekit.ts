import { upload, UploadResponse } from "@imagekit/next";

// I use this to upload images to ImageKit

//  Used to throw meaningful upload-related errors instead of generic ones.

export class UploadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UploadError";
  }
}

//  Image Validation Rules
//  Only allow specific image formats
//  -Limit image size to 10MB

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
];

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB

//Validates the selected image file

function validateImage(file: File): void {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new UploadError(`Invalid image type: ${file.type}`);
  }

  if (file.size > MAX_IMAGE_SIZE) {
    throw new UploadError("Image must be smaller than 10MB");
  }
}

//  ImageKit Authentication
//  Fetches auth credentials from the backend.
//  Falls back to mock auth for demo or dev environments.

async function getImageKitAuth() {
  try {
    const response = await fetch("/api/image/upload-auth", {
      cache: "no-store",
    });

    if (!response.ok) throw new Error("Auth request failed");

    const data = await response.json();

    if (!data.signature || !data.token || !data.expire || !data.publicKey) {
      throw new Error("Invalid auth response");
    }

    return data;
  } catch {
    // Demo fallback (useful when backend is unavailable)
    console.warn(
      "ImageKit auth API not found. Using mock credentials for demo.",
    );

    return {
      signature: "mock_signature",
      token: "mock_token",
      expire: 123456789,
      publicKey: "mock_public_key",
    };
  }
}

// Upload Result Type
export interface UploadResult {
  url: string;
  fileId: string;
  name: string;
  size: number;
  width?: number;
  height?: number;
}

export interface UploadOptions {
  folder?: string;
  tags?: string[];
  fileName?: string;
  transformation?: {
    width?: number;
    height?: number;
    quality?: number;
    format?: string;
  };
}

// Uploads an image to ImageKit
export async function uploadToImageKit(
  file: File,
  options: UploadOptions = {},
  onProgress?: (progress: number) => void,
): Promise<UploadResult> {
  // Step 1: Validate image
  validateImage(file);

  // Step 2: Get auth credentials
  const auth = await getImageKitAuth();

  /**
   * If using mock auth, simulate upload
   * This keeps UI behavior realistic in demo/dev environments
   */
  if (auth.publicKey === "mock_public_key") {
    return new Promise((resolve) => {
      let progress = 0;

      const interval = setInterval(() => {
        progress += 5;
        onProgress?.(progress);

        if (progress >= 100) {
          clearInterval(interval);

          resolve({
            url: `https://picsum.photos/seed/${Math.random()}/800/600`,
            fileId: `mock_${Math.random().toString(36).slice(2)}`,
            name: file.name,
            size: file.size,
          });
        }
      }, 50);
    });
  }

  // Step 3: Upload to ImageKit
  const response: UploadResponse = await upload({
    ...auth,
    file,
    fileName:
      options.fileName ?? `${Date.now()}-${file.name.replace(/\s+/g, "_")}`,
    folder: options.folder ?? "/collections",
    tags: options.tags ?? ["collection"],
    useUniqueFileName: true,
    transformations: options.transformation
      ? [options.transformation]
      : undefined,
    onProgress: onProgress
      ? (event) => onProgress(Math.round((event.loaded / event.total) * 100))
      : undefined,
  });

  // Step 4: Return clean upload result object to
  return {
    url: response.url!,
    fileId: response.fileId!,
    name: response.name!,
    size: response.size!,
    width: response.width,
    height: response.height,
  };
}

//  Multiple Image Upload

//  Uploads images sequentially to preserve progress tracking per file.

export async function uploadMultipleToImageKit(
  files: File[],
  options: UploadOptions = {},
  onProgress?: (fileIndex: number, progress: number) => void,
): Promise<UploadResult[]> {
  const results: UploadResult[] = [];

  for (let i = 0; i < files.length; i++) {
    const result = await uploadToImageKit(files[i], options, (progress) =>
      onProgress?.(i, progress),
    );

    results.push(result);
  }

  return results;
}

//  ImageKit URL Transformer
//  Adds ImageKit transformations directly into the image URL.

export function getImageKitUrl(
  url: string,
  transform?: {
    width?: number;
    height?: number;
    quality?: number;
    format?: string;
  },
): string {
  if (!url) {
    return "/placeholder-image.jpg"; // or your default placeholder
  }
  if (!transform) return url;

  const transformations: string[] = [];

  if (transform.width) transformations.push(`w-${transform.width}`);
  if (transform.height) transformations.push(`h-${transform.height}`);
  if (transform.quality) transformations.push(`q-${transform.quality}`);
  if (transform.format) transformations.push(`f-${transform.format}`);

  return url.replace("/upload/", `/upload/tr:${transformations.join(",")}/`);
}

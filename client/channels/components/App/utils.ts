/**
 * Copyright 2020 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { ResizeType, resize as wasmResize } from './resize';

export function getImageData(
  drawable: ImageBitmap | HTMLImageElement,
): ImageData {
  // Make canvas same size as image
  const canvas = document.createElement('canvas');
  canvas.width = drawable.width;
  canvas.height = drawable.height;
  // Draw image onto canvas
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not create canvas context');
  ctx.drawImage(drawable, 0, 0);
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

export async function decodeImage(url: string): Promise<HTMLImageElement> {
  const img = new Image();
  img.decoding = 'async';
  img.src = url;
  await img.decode();
  return img;
}

export async function blobToImg(
  blob: Blob,
): Promise<HTMLImageElement | ImageBitmap> {
  if ('createImageBitmap' in window) {
    return createImageBitmap(blob);
  }

  const url = URL.createObjectURL(blob);

  try {
    return await decodeImage(url);
  } finally {
    URL.revokeObjectURL(url);
  }
}

interface ResizeOptions {
  width?: number;
  height?: number;
  type?: ResizeType;
}

export async function resize(
  img: ImageData,
  { width, height, type = 'lanczos3' }: ResizeOptions = {},
): Promise<ImageData> {
  let targetWidth: number;
  let targetHeight: number;

  if (width !== undefined) {
    targetWidth = Math.round(width) || 1;
    targetHeight = Math.round((img.height * width) / img.width) || 1;
  } else if (height !== undefined) {
    targetHeight = Math.round(height) || 1;
    targetWidth = Math.round((img.width * height) / img.height) || 1;
  } else {
    throw Error('Must specify width or height');
  }

  return wasmResize(img, targetWidth, targetHeight, type);
}

export async function resizeToBounds(
  img: ImageData,
  width: number,
  height: number,
): Promise<ImageData> {
  if (img.width <= width && img.height <= height) return img;

  const imgRatio = img.width / img.height;
  const boundRatio = width / height;

  if (imgRatio > boundRatio) {
    return resize(img, { width });
  }

  return resize(img, { height });
}

export async function resizeByFactor(
  resizedImg: ImageData,
  factor: number,
  resizeType: ResizeType,
): Promise<ImageData> {
  return factor === 1
    ? resizedImg
    : resize(resizedImg, {
        width: resizedImg.width * factor,
        type: resizeType,
      });
}

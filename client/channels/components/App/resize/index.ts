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
import wasmURL from 'asset-url:./resize.wasm';

interface WasmExports {
  __wbindgen_malloc: (num: number) => number;
  __wbindgen_free: (num1: number, num2: number) => void;
  resize: (
    num1: number,
    num2: number,
    num3: number,
    inputWidth: number,
    inputHeight: number,
    outputWidth: number,
    outputHeight: number,
    type: number,
  ) => void;
  memory: WebAssembly.Memory;
}

const wasmExportsP = WebAssembly.instantiateStreaming(fetch(wasmURL)).then(
  (wasm) => wasm.instance.exports,
) as Promise<WasmExports>;

let cachegetUint8Memory0: Uint8Array;

function getUint8Memory0(wasm: WasmExports) {
  if (
    !cachegetUint8Memory0 ||
    cachegetUint8Memory0.buffer !== wasm.memory.buffer
  ) {
    cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
  }
  return cachegetUint8Memory0;
}

let WASM_VECTOR_LEN = 0;

function passArray8ToWasm0(wasm: WasmExports, arg: Uint8ClampedArray) {
  const ptr = wasm.__wbindgen_malloc(arg.length * 1);
  getUint8Memory0(wasm).set(arg, ptr);
  WASM_VECTOR_LEN = arg.length;
  return ptr;
}

let cachegetInt32Memory0: Int32Array;

function getInt32Memory0(wasm: WasmExports) {
  if (
    !cachegetInt32Memory0 ||
    cachegetInt32Memory0.buffer !== wasm.memory.buffer
  ) {
    cachegetInt32Memory0 = new Int32Array(wasm.memory.buffer);
  }
  return cachegetInt32Memory0;
}

function getArrayU8FromWasm0(wasm: WasmExports, ptr: number, len: number) {
  return getUint8Memory0(wasm).subarray(ptr, ptr + len);
}

const types = {
  triangle: 0,
  catrom: 1,
  mitchell: 2,
  lanczos3: 3,
};

export type ResizeType = keyof typeof types;

export async function resize(
  inputImage: ImageData,
  outputWidth: number,
  outputHeight: number,
  type: ResizeType,
) {
  const wasm = await wasmExportsP;
  var ptr0 = passArray8ToWasm0(wasm, inputImage.data);
  var len0 = WASM_VECTOR_LEN;
  wasm.resize(
    8,
    ptr0,
    len0,
    inputImage.width,
    inputImage.height,
    outputWidth,
    outputHeight,
    types[type],
  );
  var r0 = getInt32Memory0(wasm)[8 / 4 + 0];
  var r1 = getInt32Memory0(wasm)[8 / 4 + 1];
  const returnData = getArrayU8FromWasm0(wasm, r0, r1);
  const img = new ImageData(outputWidth, outputHeight);
  img.data.set(returnData);
  wasm.__wbindgen_free(r0, r1 * 1);
  return img;
}

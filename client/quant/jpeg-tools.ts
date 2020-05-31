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
/**
  Copyright (c) 2008, Adobe Systems Incorporated
  All rights reserved.
  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are
  met:
  * Redistributions of source code must retain the above copyright notice,
    this list of conditions and the following disclaimer.

  * Redistributions in binary form must reproduce the above copyright
    notice, this list of conditions and the following disclaimer in the
    documentation and/or other materials provided with the distribution.

  * Neither the name of Adobe Systems Incorporated nor the names of its
    contributors may be used to endorse or promote products derived from
    this software without specific prior written permission.
  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
  IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
  THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
  PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR
  CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
  PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
  PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
  SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
// From https://github.com/eugeneware/jpeg-js
export function dct(input: number[], fdtbl: number[]): number[] {
  const data = input.slice();

  var d0: number,
    d1: number,
    d2: number,
    d3: number,
    d4: number,
    d5: number,
    d6: number,
    d7: number;

  /* Pass 1: process rows. */
  var dataOff = 0;
  var i: number;
  var I8 = 8;
  var I64 = 64;
  for (i = 0; i < I8; ++i) {
    d0 = data[dataOff];
    d1 = data[dataOff + 1];
    d2 = data[dataOff + 2];
    d3 = data[dataOff + 3];
    d4 = data[dataOff + 4];
    d5 = data[dataOff + 5];
    d6 = data[dataOff + 6];
    d7 = data[dataOff + 7];

    var tmp0 = d0 + d7;
    var tmp7 = d0 - d7;
    var tmp1 = d1 + d6;
    var tmp6 = d1 - d6;
    var tmp2 = d2 + d5;
    var tmp5 = d2 - d5;
    var tmp3 = d3 + d4;
    var tmp4 = d3 - d4;

    /* Even part */
    var tmp10 = tmp0 + tmp3; /* phase 2 */
    var tmp13 = tmp0 - tmp3;
    var tmp11 = tmp1 + tmp2;
    var tmp12 = tmp1 - tmp2;

    data[dataOff] = tmp10 + tmp11; /* phase 3 */
    data[dataOff + 4] = tmp10 - tmp11;

    var z1 = (tmp12 + tmp13) * 0.707106781; /* c4 */
    data[dataOff + 2] = tmp13 + z1; /* phase 5 */
    data[dataOff + 6] = tmp13 - z1;

    /* Odd part */
    tmp10 = tmp4 + tmp5; /* phase 2 */
    tmp11 = tmp5 + tmp6;
    tmp12 = tmp6 + tmp7;

    /* The rotator is modified from fig 4-8 to avoid extra negations. */
    var z5 = (tmp10 - tmp12) * 0.382683433; /* c6 */
    var z2 = 0.5411961 * tmp10 + z5; /* c2-c6 */
    var z4 = 1.306562965 * tmp12 + z5; /* c2+c6 */
    var z3 = tmp11 * 0.707106781; /* c4 */

    var z11 = tmp7 + z3; /* phase 5 */
    var z13 = tmp7 - z3;

    data[dataOff + 5] = z13 + z2; /* phase 6 */
    data[dataOff + 3] = z13 - z2;
    data[dataOff + 1] = z11 + z4;
    data[dataOff + 7] = z11 - z4;

    dataOff += 8; /* advance pointer to next row */
  }

  /* Pass 2: process columns. */
  dataOff = 0;
  for (i = 0; i < I8; ++i) {
    d0 = data[dataOff];
    d1 = data[dataOff + 8];
    d2 = data[dataOff + 16];
    d3 = data[dataOff + 24];
    d4 = data[dataOff + 32];
    d5 = data[dataOff + 40];
    d6 = data[dataOff + 48];
    d7 = data[dataOff + 56];

    var tmp0p2 = d0 + d7;
    var tmp7p2 = d0 - d7;
    var tmp1p2 = d1 + d6;
    var tmp6p2 = d1 - d6;
    var tmp2p2 = d2 + d5;
    var tmp5p2 = d2 - d5;
    var tmp3p2 = d3 + d4;
    var tmp4p2 = d3 - d4;

    /* Even part */
    var tmp10p2 = tmp0p2 + tmp3p2; /* phase 2 */
    var tmp13p2 = tmp0p2 - tmp3p2;
    var tmp11p2 = tmp1p2 + tmp2p2;
    var tmp12p2 = tmp1p2 - tmp2p2;

    data[dataOff] = tmp10p2 + tmp11p2; /* phase 3 */
    data[dataOff + 32] = tmp10p2 - tmp11p2;

    var z1p2 = (tmp12p2 + tmp13p2) * 0.707106781; /* c4 */
    data[dataOff + 16] = tmp13p2 + z1p2; /* phase 5 */
    data[dataOff + 48] = tmp13p2 - z1p2;

    /* Odd part */
    tmp10p2 = tmp4p2 + tmp5p2; /* phase 2 */
    tmp11p2 = tmp5p2 + tmp6p2;
    tmp12p2 = tmp6p2 + tmp7p2;

    /* The rotator is modified from fig 4-8 to avoid extra negations. */
    var z5p2 = (tmp10p2 - tmp12p2) * 0.382683433; /* c6 */
    var z2p2 = 0.5411961 * tmp10p2 + z5p2; /* c2-c6 */
    var z4p2 = 1.306562965 * tmp12p2 + z5p2; /* c2+c6 */
    var z3p2 = tmp11p2 * 0.707106781; /* c4 */

    var z11p2 = tmp7p2 + z3p2; /* phase 5 */
    var z13p2 = tmp7p2 - z3p2;

    data[dataOff + 40] = z13p2 + z2p2; /* phase 6 */
    data[dataOff + 24] = z13p2 - z2p2;
    data[dataOff + 8] = z11p2 + z4p2;
    data[dataOff + 56] = z11p2 - z4p2;

    dataOff++; /* advance pointer to next column */
  }

  const outputfDCTQuant = Array(data.length);

  // Quantize/descale the coefficients
  var fDCTQuant: number;
  for (i = 0; i < I64; ++i) {
    // Apply the quantization and scaling factor & Round to nearest integer
    fDCTQuant = data[i] * fdtbl[i];
    outputfDCTQuant[i] =
      fDCTQuant > 0.0 ? (fDCTQuant + 0.5) | 0 : (fDCTQuant - 0.5) | 0;
  }
  return outputfDCTQuant;
}

var dctCos1 = 4017; // cos(pi/16)
var dctSin1 = 799; // sin(pi/16)
var dctCos3 = 3406; // cos(3*pi/16)
var dctSin3 = 2276; // sin(3*pi/16)
var dctCos6 = 1567; // cos(6*pi/16)
var dctSin6 = 3784; // sin(6*pi/16)
var dctSqrt2 = 5793; // sqrt(2)
var dctSqrt1d2 = 2896; // sqrt(2) / 2

// A port of poppler's IDCT method which in turn is taken from:
//   Christoph Loeffler, Adriaan Ligtenberg, George S. Moschytz,
//   "Practical Fast 1-D DCT Algorithms with 11 Multiplications",
//   IEEE Intl. Conf. on Acoustics, Speech & Signal Processing, 1989,
//   988-991.
export function inverseDCT(
  input: number[],
  table: number[],
  output: Uint8Array,
): void {
  const dataIn = new Int32Array(64);

  var v0: number,
    v1: number,
    v2: number,
    v3: number,
    v4: number,
    v5: number,
    v6: number,
    v7: number,
    t: number;
  var p = dataIn;
  var i: number;

  // dequant
  for (i = 0; i < 64; i++) p[i] = input[i] * table[zigZag[i]];

  // inverse DCT on rows
  for (i = 0; i < 8; ++i) {
    var row = 8 * i;

    // check for all-zero AC coefficients
    if (
      p[1 + row] == 0 &&
      p[2 + row] == 0 &&
      p[3 + row] == 0 &&
      p[4 + row] == 0 &&
      p[5 + row] == 0 &&
      p[6 + row] == 0 &&
      p[7 + row] == 0
    ) {
      t = (dctSqrt2 * p[0 + row] + 512) >> 10;
      p[0 + row] = t;
      p[1 + row] = t;
      p[2 + row] = t;
      p[3 + row] = t;
      p[4 + row] = t;
      p[5 + row] = t;
      p[6 + row] = t;
      p[7 + row] = t;
      continue;
    }

    // stage 4
    v0 = (dctSqrt2 * p[0 + row] + 128) >> 8;
    v1 = (dctSqrt2 * p[4 + row] + 128) >> 8;
    v2 = p[2 + row];
    v3 = p[6 + row];
    v4 = (dctSqrt1d2 * (p[1 + row] - p[7 + row]) + 128) >> 8;
    v7 = (dctSqrt1d2 * (p[1 + row] + p[7 + row]) + 128) >> 8;
    v5 = p[3 + row] << 4;
    v6 = p[5 + row] << 4;

    // stage 3
    t = (v0 - v1 + 1) >> 1;
    v0 = (v0 + v1 + 1) >> 1;
    v1 = t;
    t = (v2 * dctSin6 + v3 * dctCos6 + 128) >> 8;
    v2 = (v2 * dctCos6 - v3 * dctSin6 + 128) >> 8;
    v3 = t;
    t = (v4 - v6 + 1) >> 1;
    v4 = (v4 + v6 + 1) >> 1;
    v6 = t;
    t = (v7 + v5 + 1) >> 1;
    v5 = (v7 - v5 + 1) >> 1;
    v7 = t;

    // stage 2
    t = (v0 - v3 + 1) >> 1;
    v0 = (v0 + v3 + 1) >> 1;
    v3 = t;
    t = (v1 - v2 + 1) >> 1;
    v1 = (v1 + v2 + 1) >> 1;
    v2 = t;
    t = (v4 * dctSin3 + v7 * dctCos3 + 2048) >> 12;
    v4 = (v4 * dctCos3 - v7 * dctSin3 + 2048) >> 12;
    v7 = t;
    t = (v5 * dctSin1 + v6 * dctCos1 + 2048) >> 12;
    v5 = (v5 * dctCos1 - v6 * dctSin1 + 2048) >> 12;
    v6 = t;

    // stage 1
    p[0 + row] = v0 + v7;
    p[7 + row] = v0 - v7;
    p[1 + row] = v1 + v6;
    p[6 + row] = v1 - v6;
    p[2 + row] = v2 + v5;
    p[5 + row] = v2 - v5;
    p[3 + row] = v3 + v4;
    p[4 + row] = v3 - v4;
  }

  // inverse DCT on columns
  for (i = 0; i < 8; ++i) {
    var col = i;

    // check for all-zero AC coefficients
    if (
      p[1 * 8 + col] == 0 &&
      p[2 * 8 + col] == 0 &&
      p[3 * 8 + col] == 0 &&
      p[4 * 8 + col] == 0 &&
      p[5 * 8 + col] == 0 &&
      p[6 * 8 + col] == 0 &&
      p[7 * 8 + col] == 0
    ) {
      t = (dctSqrt2 * dataIn[i + 0] + 8192) >> 14;
      p[0 * 8 + col] = t;
      p[1 * 8 + col] = t;
      p[2 * 8 + col] = t;
      p[3 * 8 + col] = t;
      p[4 * 8 + col] = t;
      p[5 * 8 + col] = t;
      p[6 * 8 + col] = t;
      p[7 * 8 + col] = t;
      continue;
    }

    // stage 4
    v0 = (dctSqrt2 * p[0 * 8 + col] + 2048) >> 12;
    v1 = (dctSqrt2 * p[4 * 8 + col] + 2048) >> 12;
    v2 = p[2 * 8 + col];
    v3 = p[6 * 8 + col];
    v4 = (dctSqrt1d2 * (p[1 * 8 + col] - p[7 * 8 + col]) + 2048) >> 12;
    v7 = (dctSqrt1d2 * (p[1 * 8 + col] + p[7 * 8 + col]) + 2048) >> 12;
    v5 = p[3 * 8 + col];
    v6 = p[5 * 8 + col];

    // stage 3
    t = (v0 - v1 + 1) >> 1;
    v0 = (v0 + v1 + 1) >> 1;
    v1 = t;
    t = (v2 * dctSin6 + v3 * dctCos6 + 2048) >> 12;
    v2 = (v2 * dctCos6 - v3 * dctSin6 + 2048) >> 12;
    v3 = t;
    t = (v4 - v6 + 1) >> 1;
    v4 = (v4 + v6 + 1) >> 1;
    v6 = t;
    t = (v7 + v5 + 1) >> 1;
    v5 = (v7 - v5 + 1) >> 1;
    v7 = t;

    // stage 2
    t = (v0 - v3 + 1) >> 1;
    v0 = (v0 + v3 + 1) >> 1;
    v3 = t;
    t = (v1 - v2 + 1) >> 1;
    v1 = (v1 + v2 + 1) >> 1;
    v2 = t;
    t = (v4 * dctSin3 + v7 * dctCos3 + 2048) >> 12;
    v4 = (v4 * dctCos3 - v7 * dctSin3 + 2048) >> 12;
    v7 = t;
    t = (v5 * dctSin1 + v6 * dctCos1 + 2048) >> 12;
    v5 = (v5 * dctCos1 - v6 * dctSin1 + 2048) >> 12;
    v6 = t;

    // stage 1
    p[0 * 8 + col] = v0 + v7;
    p[7 * 8 + col] = v0 - v7;
    p[1 * 8 + col] = v1 + v6;
    p[6 * 8 + col] = v1 - v6;
    p[2 * 8 + col] = v2 + v5;
    p[5 * 8 + col] = v2 - v5;
    p[3 * 8 + col] = v3 + v4;
    p[4 * 8 + col] = v3 - v4;
  }

  // convert to 8-bit integers
  for (i = 0; i < 64; ++i) {
    var sample = 128 + ((p[i] + 8) >> 4);
    output[i] = sample < 0 ? 0 : sample > 0xff ? 0xff : sample;
  }
}

// prettier-ignore
export const zigZag = [
  0, 1, 5, 6,14,15,27,28,
  2, 4, 7,13,16,26,29,42,
  3, 8,12,17,25,30,41,43,
  9,11,18,24,31,40,44,53,
  10,19,23,32,39,45,52,54,
  20,22,33,38,46,51,55,60,
  21,34,37,47,50,56,59,61,
  35,36,48,49,57,58,62,63,
];

// prettier-ignore
export const inverseZigZag = new Uint8Array([
  0,
  1,  8,
 16,  9,  2,
  3, 10, 17, 24,
 32, 25, 18, 11, 4,
  5, 12, 19, 26, 33, 40,
 48, 41, 34, 27, 20, 13,  6,
  7, 14, 21, 28, 35, 42, 49, 56,
 57, 50, 43, 36, 29, 22, 15,
 23, 30, 37, 44, 51, 58,
 59, 52, 45, 38, 31,
 39, 46, 53, 60,
 61, 54, 47,
 55, 62,
 63
]);

export function initQuantTables(quality: number) {
  var sf = 0;
  if (quality < 50) {
    sf = Math.floor(5000 / quality);
  } else {
    sf = Math.floor(200 - quality * 2);
  }

  // prettier-ignore
  const YQT = [
    16, 11, 10, 16, 24, 40, 51, 61,
    12, 12, 14, 19, 26, 58, 60, 55,
    14, 13, 16, 24, 40, 57, 69, 56,
    14, 17, 22, 29, 51, 87, 80, 62,
    18, 22, 37, 56, 68,109,103, 77,
    24, 35, 55, 64, 81,104,113, 92,
    49, 64, 78, 87,103,121,120,101,
    72, 92, 95, 98,112,100,103, 99
  ];

  var yTable: number[] = [];
  var fdtbl_Y: number[] = [];

  for (var i = 0; i < 64; i++) {
    var t = Math.floor((YQT[i] * sf + 50) / 100);
    if (t < 1) {
      t = 1;
    } else if (t > 255) {
      t = 255;
    }
    yTable[zigZag[i]] = t;
  }
  // prettier-ignore
  var aasf = [
    1.0, 1.387039845, 1.306562965, 1.175875602,
    1.0, 0.785694958, 0.541196100, 0.275899379
  ];
  var k = 0;
  for (var row = 0; row < 8; row++) {
    for (var col = 0; col < 8; col++) {
      fdtbl_Y[k] = 1.0 / (yTable[zigZag[k]] * aasf[row] * aasf[col] * 8.0);
      k++;
    }
  }

  return [fdtbl_Y, yTable];
}

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
import '../file-drop';
import { h, Component, render, createRef } from 'preact';
import ChromaCanvas from './ChromaCanvas';
import Controls, { Values } from './Controls';
import {
  $layout,
  $app,
  $canvasContainer,
} from 'shared/channels-styles/App.css';
import * as demoImages from '../imgs';
import { FileDropEvent } from '../file-drop';
import { resize as wasmResize, ResizeType } from './resize/resize';

const demos = new Map<string, string>(Object.entries(demoImages));
const urlParams = new URLSearchParams(location.search);
const hideUi = urlParams.get('hideUi') === '1';
const demoImg = demos.get(urlParams.get('demo') || '');
const lumaDefault = Number(urlParams.get('l')) || 1;
const chromaDefault = Number(urlParams.get('uv')) || 0.1;

function getImageData(drawable: ImageBitmap | HTMLImageElement): ImageData {
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

async function decodeImage(url: string): Promise<HTMLImageElement> {
  const img = new Image();
  img.decoding = 'async';
  img.src = url;
  await img.decode();
  return img;
}

async function blobToImg(blob: Blob): Promise<HTMLImageElement | ImageBitmap> {
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

async function resize(
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

async function resizeToBounds(
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

async function getChannel(
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

interface UpdateOptions {
  updateMain?: Blob;
  updateResized?: boolean;
  updateChroma?: boolean;
  updateLuma?: boolean;
}

interface State {
  mainBmp?: ImageData;
  resizedBmp?: ImageData;
  lumaBmp?: ImageData;
  chromaBmp?: ImageData;
  lumaMulti: number;
  chromaMulti: number;
  showY: boolean;
  showCb: boolean;
  showCr: boolean;
  resizeType: ResizeType;
}

class App extends Component<{}, State> {
  state: State = {
    lumaMulti: lumaDefault,
    chromaMulti: chromaDefault,
    showY: true,
    showCb: true,
    showCr: true,
    resizeType: 'lanczos3',
  };

  private _resizeTimeout: number = 0;
  private _rangeTimeout: number = 0;
  private _canvasContainerRef = createRef<HTMLDivElement>();
  private _updateController?: AbortController;

  constructor() {
    super();
    if (demoImg) {
      fetch(demoImg)
        .then((r) => r.blob())
        .then((blob) => this._openFile(blob));
    }
  }

  private async _update({
    updateMain,
    updateResized,
    updateChroma,
    updateLuma,
  }: UpdateOptions = {}) {
    if (this._updateController) this._updateController.abort();
    this._updateController = new AbortController();
    const { signal } = this._updateController;

    const mainBmp = updateMain
      ? getImageData(await blobToImg(updateMain))
      : this.state.mainBmp!;

    if (signal.aborted) return;

    const bounds = this._canvasContainerRef.current!.getBoundingClientRect();
    const resizedBmp = updateResized
      ? await resizeToBounds(
          mainBmp,
          bounds.width * devicePixelRatio,
          bounds.height * devicePixelRatio,
        )
      : this.state.resizedBmp!;

    if (signal.aborted) return;

    const [lumaBmp, chromaBmp] = await Promise.all([
      updateLuma
        ? getChannel(resizedBmp, this.state.lumaMulti, this.state.resizeType)
        : this.state.lumaBmp!,
      updateChroma
        ? getChannel(resizedBmp, this.state.chromaMulti, this.state.resizeType)
        : this.state.chromaBmp!,
    ]);

    if (signal.aborted) return;

    this.setState({
      mainBmp,
      resizedBmp,
      lumaBmp,
      chromaBmp,
    });
  }

  private async _openFile(blob: Blob) {
    this._update({
      updateMain: blob,
      updateResized: true,
      updateChroma: true,
      updateLuma: true,
    });
  }

  private _onFileChange = async (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (!input.files || !input.files[0]) return;
    this._openFile(input.files[0]);
  };

  private _onDrop = (event: FileDropEvent) => {
    this._openFile(event.files[0]);
  };

  private _onResize = () => {
    clearTimeout(this._resizeTimeout);

    this._resizeTimeout = setTimeout(async () => {
      if (!this.state.mainBmp) return;

      this._update({
        updateResized: true,
        updateChroma: true,
        updateLuma: true,
      });
    }, 100);
  };

  private _onControlsChange = (values: Values) => {
    this.setState({
      chromaMulti: values.chromaMulti,
      lumaMulti: values.lumaMulti,
      showY: values.showY,
      showCb: values.showCb,
      showCr: values.showCr,
      resizeType: values.resizeType,
    });
  };

  componentDidMount() {
    addEventListener('resize', this._onResize);
  }

  componentWillUnmount() {
    removeEventListener('resize', this._onResize);
  }

  componentDidUpdate(_: {}, oldState: State) {
    const resizeChanged = this.state.resizeType !== oldState.resizeType;
    const updateChroma =
      resizeChanged || this.state.chromaMulti !== oldState.chromaMulti;
    const updateLuma =
      resizeChanged || this.state.lumaMulti !== oldState.lumaMulti;

    if (updateChroma || updateLuma) {
      clearTimeout(this._rangeTimeout);
      this._rangeTimeout = setTimeout(() => {
        this._update({
          updateChroma,
          updateLuma,
        });
      }, 20);
    }
  }

  render(
    {},
    {
      resizedBmp,
      lumaBmp,
      chromaBmp,
      chromaMulti,
      lumaMulti,
      showY,
      showCb,
      showCr,
      resizeType,
    }: State,
  ) {
    return (
      <file-drop class={$app} accept="image/*" onfiledrop={this._onDrop}>
        <div class={$layout}>
          <div class={$canvasContainer} ref={this._canvasContainerRef}>
            {resizedBmp && lumaBmp && chromaBmp && (
              <ChromaCanvas
                chromaBmp={chromaBmp}
                lumaBmp={lumaBmp}
                width={resizedBmp.width}
                height={resizedBmp.height}
                showY={showY}
                showCb={showCb}
                showCr={showCr}
              />
            )}
          </div>
          {!hideUi && (
            <Controls
              lumaMulti={lumaMulti}
              chromaMulti={chromaMulti}
              onChange={this._onControlsChange}
              width={resizedBmp ? resizedBmp.width : 0}
              height={resizedBmp ? resizedBmp.height : 0}
              showY={showY}
              showCb={showCb}
              showCr={showCr}
              resizeType={resizeType}
            />
          )}
        </div>
        {!hideUi && (
          <input type="file" accept="image/*" onChange={this._onFileChange} />
        )}
      </file-drop>
    );
  }
}

render(<App />, document.body);

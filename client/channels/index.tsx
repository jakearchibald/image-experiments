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
import { h, Component, render, createRef } from 'preact';
import ChromaCanvas from './ChromaCanvas';
import Controls, { Values } from './Controls';
import {
  $layout,
  $app,
  $canvasContainer,
} from 'shared/channels-styles/App.css';
import woodsImg from 'asset-url:../woods.jpg';
import f1Img from 'asset-url:../f1.jpg';

const demos = new Map<string, string>([
  ['woods', woodsImg],
  ['f1', f1Img],
]);

const urlParams = new URLSearchParams(location.search);
const hideUi = urlParams.get('hideUi') === '1';
const demoImg = demos.get(urlParams.get('demo') || '');
const lumaDefault = Number(urlParams.get('l')) || 1;
const chromaDefault = Number(urlParams.get('uv')) || 0.1;

async function resizeToBounds(
  bmp: ImageBitmap,
  width: number,
  height: number,
): Promise<ImageBitmap> {
  if (bmp.width <= width && bmp.height <= height) return bmp;

  const imgRatio = bmp.width / bmp.height;
  const boundRatio = width / height;

  if (imgRatio > boundRatio) {
    return createImageBitmap(bmp, {
      resizeWidth: width,
      resizeQuality: 'high',
    });
  }

  return createImageBitmap(bmp, {
    resizeHeight: height,
    resizeQuality: 'high',
  });
}

async function getChannel(
  resizedBmp: ImageBitmap,
  factor: number,
): Promise<ImageBitmap> {
  return factor === 1
    ? resizedBmp
    : createImageBitmap(resizedBmp, {
        resizeWidth: Math.ceil(resizedBmp.width * factor),
      });
}

interface State {
  mainBmp?: ImageBitmap;
  resizedBmp?: ImageBitmap;
  lumaBmp?: ImageBitmap;
  chromaBmp?: ImageBitmap;
  lumaMulti: number;
  chromaMulti: number;
  showY: boolean;
  showCb: boolean;
  showCr: boolean;
}

class App extends Component<{}, State> {
  state: State = {
    lumaMulti: lumaDefault,
    chromaMulti: chromaDefault,
    showY: true,
    showCb: true,
    showCr: true,
  };

  private _resizeTimeout: number = 0;
  private _rangeTimeout: number = 0;
  private _canvasContainerRef = createRef<HTMLDivElement>();

  constructor() {
    super();
    if (demoImg) {
      fetch(demoImg)
        .then((r) => r.blob())
        .then((blob) => this._openFile(blob));
    }
  }

  private async _openFile(blob: Blob) {
    const mainBmp = await createImageBitmap(blob);
    const bounds = this._canvasContainerRef.current!.getBoundingClientRect();
    const resizedBmp = await resizeToBounds(
      mainBmp,
      bounds.width * devicePixelRatio,
      bounds.height * devicePixelRatio,
    );

    const [lumaBmp, chromaBmp] = await Promise.all([
      getChannel(resizedBmp, this.state.lumaMulti),
      getChannel(resizedBmp, this.state.chromaMulti),
    ]);

    this.setState({
      mainBmp,
      resizedBmp,
      lumaBmp,
      chromaBmp,
    });
  }

  private _onFileChange = async (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (!input.files || !input.files[0]) return;
    this._openFile(input.files[0]);
  };

  private _onResize = () => {
    clearTimeout(this._resizeTimeout);

    this._resizeTimeout = setTimeout(async () => {
      if (!this.state.mainBmp) return;

      const bounds = this._canvasContainerRef.current!.getBoundingClientRect();
      const resizedBmp = await resizeToBounds(
        this.state.mainBmp,
        bounds.width * devicePixelRatio,
        bounds.height * devicePixelRatio,
      );

      const [lumaBmp, chromaBmp] = await Promise.all([
        getChannel(resizedBmp, this.state.lumaMulti),
        getChannel(resizedBmp, this.state.chromaMulti),
      ]);

      this.setState({
        resizedBmp,
        lumaBmp,
        chromaBmp,
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
    });
  };

  componentDidMount() {
    addEventListener('resize', this._onResize);
  }

  componentWillUnmount() {
    removeEventListener('resize', this._onResize);
  }

  componentDidUpdate(_: {}, oldState: State) {
    const state = { ...this.state };

    if (
      state.lumaMulti !== oldState.lumaMulti ||
      state.chromaMulti !== oldState.chromaMulti
    ) {
      clearTimeout(this._rangeTimeout);
      this._rangeTimeout = setTimeout(async () => {
        let newLuma: Promise<ImageBitmap> | undefined;
        let newChroma: Promise<ImageBitmap> | undefined;

        if (state.lumaMulti !== oldState.lumaMulti) {
          newLuma = getChannel(state.resizedBmp!, state.lumaMulti);
        }
        if (state.chromaMulti !== oldState.chromaMulti) {
          newChroma = getChannel(state.resizedBmp!, state.chromaMulti);
        }

        const newState: Partial<State> = {};

        if (newLuma) newState.lumaBmp = await newLuma;
        if (newChroma) newState.chromaBmp = await newChroma;
        this.setState(newState);
      }, 50);
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
    }: State,
  ) {
    return (
      <div class={$app}>
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
            />
          )}
        </div>
        {!hideUi && (
          <input type="file" accept="image/*" onChange={this._onFileChange} />
        )}
      </div>
    );
  }
}

render(<App />, document.body);

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
import 'client/file-drop';
import { FileDropEvent } from 'client/file-drop';
import { h, Component, createRef } from 'preact';
import ChromaCanvas from '../ChromaCanvas';
import Controls, { Values } from '../Controls';
import {
  $layout,
  $app,
  $canvasContainer,
  $fileOptions,
} from 'shared/channels-styles/App.css';
import * as demoImages from 'client/imgs';
import demoImageDescriptions from 'client/imgs/descriptions';
import { ResizeType } from 'client-worker/resize';
import {
  getImageData,
  blobToImg,
  resizeToBounds,
  resizeByFactor,
  asyncResize1,
  asyncResize2,
} from './img-utils';
import { abortable } from './utils';
import NavSelect from 'client/NavSelect';

const demos = new Map<string, string>(Object.entries(demoImages));
const urlParams = new URLSearchParams(location.search);
const hideUi = urlParams.get('hideUi') === '1';
const demoImg = demos.get(urlParams.get('demo') || '');
const lumaDefault = Number(urlParams.get('l')) || 1;
const chromaDefault = Number(urlParams.get('uv')) || 0.1;

interface UpdateOptions {
  updateMain?: Blob;
  updateResized?: boolean;
  updateChroma?: boolean;
  updateLuma?: boolean;
}

interface State {
  loading: boolean;
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

export default class App extends Component<{}, State> {
  state: State = {
    loading: false,
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
  private _fileInput = createRef<HTMLInputElement>();
  private _updateController?: AbortController;

  constructor() {
    super();
    if (demoImg) this._loadImage(demoImg);
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

    try {
      const mainBmp = updateMain
        ? getImageData(await abortable(signal, blobToImg(updateMain)))
        : this.state.mainBmp!;

      const bounds = this._canvasContainerRef.current!.getBoundingClientRect();
      const resizedBmp = updateResized
        ? await resizeToBounds(
            signal,
            mainBmp,
            bounds.width * devicePixelRatio,
            bounds.height * devicePixelRatio,
          )
        : this.state.resizedBmp!;

      const [lumaBmp, chromaBmp] = await Promise.all([
        updateLuma
          ? resizeByFactor(
              signal,
              resizedBmp,
              this.state.lumaMulti,
              this.state.resizeType,
              asyncResize1,
            )
          : this.state.lumaBmp!,
        updateChroma
          ? resizeByFactor(
              signal,
              resizedBmp,
              this.state.chromaMulti,
              this.state.resizeType,
              asyncResize2,
            )
          : this.state.chromaBmp!,
      ]);

      this.setState({
        mainBmp,
        resizedBmp,
        lumaBmp,
        chromaBmp,
        loading: false,
      });
    } catch (err) {
      if (err.name === 'AbortError') return;
      throw err;
    }
  }

  private async _openFile(blob: Blob) {
    this.setState({ loading: true });
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

  private _loadImage(url: string) {
    this.setState({ loading: true });
    fetch(url)
      .then((r) => r.blob())
      .then((blob) => this._openFile(blob));
  }

  private _onDemoImgSelect = (value: string) => {
    if (value) this._loadImage(value);
  };

  private _openFileClick = () => {
    this._fileInput.current!.click();
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
      loading,
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
            {loading ? (
              <div>…loading…</div>
            ) : resizedBmp && lumaBmp && chromaBmp ? (
              <ChromaCanvas
                chromaBmp={chromaBmp}
                lumaBmp={lumaBmp}
                width={resizedBmp.width}
                height={resizedBmp.height}
                showY={showY}
                showCb={showCb}
                showCr={showCr}
              />
            ) : (
              false
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
          <div class={$fileOptions}>
            <button onClick={this._openFileClick}>Open file</button>
            <input
              ref={this._fileInput}
              type="file"
              accept="image/*"
              onChange={this._onFileChange}
            />{' '}
            <NavSelect onChange={this._onDemoImgSelect}>
              <option value="">Or pick a demo</option>
              {Object.entries(demoImageDescriptions).map(([title, url]) => (
                <option value={url}>{title}</option>
              ))}
            </NavSelect>
          </div>
        )}
      </file-drop>
    );
  }
}

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
import { h, Component, render, Fragment, createRef } from 'preact';
import '../file-drop';
import { FileDropEvent } from '../file-drop';
import http203Img from 'asset-url:./203.webp';
import curveImg from 'asset-url:./curve.webp';
import * as demoImages from '../imgs';
import demoImageDescriptions from 'client/imgs/descriptions';
import BlockRender from './BlockRender';
import CompressedBlockRender from './CompressedBlockRender';
import {
  $images,
  $app,
  $phases,
  $phase,
  $fileOptions,
} from 'shared/quant-styles/App.css';
import Controls, { Values } from './Controls';
import { dct, initQuantTables, inverseZigZag } from './jpeg-tools';
import ImageSelect from './ImageSelect';
import NavSelect from 'client/NavSelect';

const params = new URLSearchParams(location.search);
const demo = new Map<string, string>([
  ['203', http203Img],
  ['curve', curveImg],
  ...Object.entries(demoImages),
]);

const demoOptions = {
  ...demoImageDescriptions,
  [`203 'pixel art'`]: http203Img,
  'Curve block': curveImg,
};

const initalImage = demo.get(params.get('demo') || '');

interface State {
  loading: boolean;
  selectingImage?: ImageBitmap;
  data?: Uint8Array;
  dctData?: number[];
  decodeTable?: number[];
  quality: number;
  phase: number;
}

class App extends Component<{}, State> {
  private _fileInput = createRef<HTMLInputElement>();

  state: State = {
    loading: false,
    quality: 100,
    phase: 63,
  };

  componentDidMount() {
    if (initalImage) this._loadImageURL(initalImage);
  }

  private _loadImageURL(url: string) {
    this.setState({ loading: true });
    fetch(url)
      .then((r) => r.blob())
      .then((blob) => this._openFile(blob));
  }

  private _updateDCT() {
    this.setState((state) => {
      const balancedData = [...state.data!].map((num) => num - 128);
      const [encodeTable, decodeTable] = initQuantTables(state.quality);
      const dctData = dct(balancedData, encodeTable);
      return { dctData, decodeTable };
    });
  }

  private _onControlsChange = (values: Values) => {
    this.setState({
      quality: values.quality,
      phase: values.phase,
    });

    if (values.quality !== this.state.quality) {
      this._updateDCT();
    }
  };

  private async _openFile(blob: Blob) {
    const bmp = await createImageBitmap(blob);

    if (bmp.width > 8 || bmp.height > 8) {
      this.setState({
        selectingImage: bmp,
        loading: false,
      });
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 8;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(bmp, 0, 0);
    this._loadImage(ctx.getImageData(0, 0, 8, 8));
  }

  private _loadImage(imageData: ImageData) {
    const data = new Uint8Array(8 * 8);

    for (let i = 0; i < data.length; i++) {
      data[i] = imageData.data[i * 4];
    }

    this.setState({ data, selectingImage: undefined, loading: false });
    this._updateDCT();
  }

  private _onFileChange = async (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (!input.files || !input.files[0]) return;
    this._openFile(input.files[0]);
  };

  private _onSelect = (data: ImageData) => {
    this._loadImage(data);
  };

  private _onDrop = (event: FileDropEvent) => {
    this._openFile(event.files[0]);
  };

  private _openFileClick = () => {
    this._fileInput.current!.click();
  };

  private _onDemoImgSelect = (value: string) => {
    if (value) this._loadImageURL(value);
  };

  render(
    {},
    {
      data,
      quality,
      phase,
      dctData,
      decodeTable,
      selectingImage,
      loading,
    }: State,
  ) {
    return (
      <file-drop class={$app} accept="image/*" onfiledrop={this._onDrop}>
        {!data && !selectingImage ? (
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
              {Object.entries(demoOptions).map(([title, url]) => (
                <option value={url}>{title}</option>
              ))}
            </NavSelect>
            {loading && ' …loading…'}
          </div>
        ) : selectingImage ? (
          <ImageSelect onSelect={this._onSelect} image={selectingImage} />
        ) : (
          <Fragment>
            <div class={$images}>
              <BlockRender data={data!} />
              <CompressedBlockRender
                start={0}
                end={phase + 1}
                dctData={dctData!}
                decodeTable={decodeTable!}
              />
            </div>
            <div class={$phases}>
              {dctData!.map((_, i) => (
                <div class={$phase} style={{ opacity: i > phase ? 0.5 : 1 }}>
                  <CompressedBlockRender
                    start={i}
                    end={i + 1}
                    dctData={dctData!}
                    decodeTable={decodeTable!}
                  />
                  <span>{dctData![inverseZigZag[i]] === 0 ? '0' : ''}</span>
                </div>
              ))}
            </div>
            <Controls
              quality={quality}
              phase={phase}
              onChange={this._onControlsChange}
            />
          </Fragment>
        )}
      </file-drop>
    );
  }
}

render(<App />, document.body);

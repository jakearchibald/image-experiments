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
import { h, Component, render, Fragment } from 'preact';
import http203Img from 'asset-url:./203.webp';
import curveImg from 'asset-url:./curve.webp';
import woodsImg from 'asset-url:../woods.jpg';
import f1Img from 'asset-url:../f1.jpg';
import BlockRender from './BlockRender';
import CompressedBlockRender from './CompressedBlockRender';
import { $images, $app, $phases, $phase } from 'shared/quant-styles/App.css';
import Controls, { Values } from './Controls';
import { dct, initQuantTables, inverseZigZag } from './jpeg-tools';
import ImageSelect from './ImageSelect';

const params = new URLSearchParams(location.search);
const demo = new Map<string, string>([
  ['203', http203Img],
  ['curve', curveImg],
  ['woods', woodsImg],
  ['f1', f1Img],
]);

const initalImage = demo.get(params.get('demo') || '');

interface State {
  selectingImage?: ImageBitmap;
  data?: Uint8Array;
  dctData?: number[];
  decodeTable?: number[];
  quality: number;
  phase: number;
}

class App extends Component<{}, State> {
  state: State = {
    quality: 100,
    phase: 63,
  };

  constructor() {
    super();
    if (initalImage) {
      fetch(initalImage)
        .then((r) => r.blob())
        .then((blob) => this._openFile(blob));
    }
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

    this.setState({ data, selectingImage: undefined });
    this._updateDCT();
  }

  private _onFileChange = async (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (!input.files || !input.files[0]) return;
    this.setState({
      selectingImage: await createImageBitmap(input.files[0]),
    });
  };

  private _onSelect = (data: ImageData) => {
    this._loadImage(data);
  };

  render(
    {},
    { data, quality, phase, dctData, decodeTable, selectingImage }: State,
  ) {
    return (
      <div class={$app}>
        {!data && !selectingImage ? (
          <input type="file" accept="image/*" onChange={this._onFileChange} />
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
      </div>
    );
  }
}

render(<App />, document.body);

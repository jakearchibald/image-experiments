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
import { h, Component, createRef } from 'preact';

import { $controls, $ranges, $toggles } from 'shared/styles/Controls.css';

export interface Values {
  lumaMulti: number;
  chromaMulti: number;
  showY: boolean;
  showCb: boolean;
  showCr: boolean;
}

interface Props extends Values {
  onChange: (values: Values) => void;
  width: number;
  height: number;
}

export default class Controls extends Component<Props> {
  private _lumaMultiRef = createRef<HTMLInputElement>();
  private _chromaMultiRef = createRef<HTMLInputElement>();
  private _showYRef = createRef<HTMLInputElement>();
  private _showCbRef = createRef<HTMLInputElement>();
  private _showCrRef = createRef<HTMLInputElement>();

  private _onChange = () => {
    this.props.onChange({
      lumaMulti: this._lumaMultiRef.current!.valueAsNumber,
      chromaMulti: this._chromaMultiRef.current!.valueAsNumber,
      showY: this._showYRef.current!.checked,
      showCb: this._showCbRef.current!.checked,
      showCr: this._showCrRef.current!.checked,
    });
  };

  render({
    lumaMulti,
    chromaMulti,
    width,
    height,
    showY,
    showCb,
    showCr,
  }: Props) {
    return (
      <div class={$controls}>
        <div class={$ranges}>
          <label for="luma-range">Luma: </label>
          <input
            id="luma-range"
            ref={this._lumaMultiRef}
            type="range"
            value={lumaMulti}
            min={0.0001}
            max={1}
            step="any"
            onInput={this._onChange}
          />
          <span>{lumaMulti.toFixed(3)}</span>
          <span>
            {Math.round(width * lumaMulti)}x{Math.round(height * lumaMulti)}
          </span>
          <label for="chroma-range">Chroma: </label>
          <input
            id="chroma-range"
            ref={this._chromaMultiRef}
            type="range"
            value={chromaMulti}
            min={0.0001}
            max={1}
            step="any"
            onInput={this._onChange}
          />
          <span>{chromaMulti.toFixed(3)}</span>
          <span>
            {Math.round(width * chromaMulti)}x{Math.round(height * chromaMulti)}
          </span>
        </div>
        <div class={$toggles}>
          <label for="show-y">Y</label>
          <input
            ref={this._showYRef}
            id="show-y"
            type="checkbox"
            checked={showY}
            onInput={this._onChange}
          />
          <label for="show-cb">Cb</label>
          <input
            ref={this._showCbRef}
            id="show-cb"
            type="checkbox"
            checked={showCb}
            onInput={this._onChange}
          />
          <label for="show-cr">Cr</label>
          <input
            ref={this._showCrRef}
            id="show-cr"
            type="checkbox"
            checked={showCr}
            onInput={this._onChange}
          />
        </div>
      </div>
    );
  }
}

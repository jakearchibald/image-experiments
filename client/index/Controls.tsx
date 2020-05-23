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

import { $controls, $ranges } from 'shared/styles/Controls.css';

export interface Values {
  lumaMulti: number;
  chromaMulti: number;
  renderY: boolean;
  renderU: boolean;
  renderV: boolean;
}

interface Props extends Values {
  onChange: (values: Values) => void;
  width: number;
  height: number;
}

export default class Controls extends Component<Props> {
  private lumaMultiRef = createRef<HTMLInputElement>();
  private chromaMultiRef = createRef<HTMLInputElement>();

  private _onChange = () => {
    this.props.onChange({
      lumaMulti: this.lumaMultiRef.current!.valueAsNumber,
      chromaMulti: this.chromaMultiRef.current!.valueAsNumber,
      renderY: true,
      renderU: true,
      renderV: true,
    });
  };

  render({ lumaMulti, chromaMulti, width, height }: Props) {
    return (
      <div class={$controls}>
        <div class={$ranges}>
          <label for="luma-range">Luma: </label>
          <input
            id="luma-range"
            ref={this.lumaMultiRef}
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
            ref={this.chromaMultiRef}
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
      </div>
    );
  }
}

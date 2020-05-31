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

import { $controls, $ranges } from 'shared/quant-styles/Controls.css';

export interface Values {
  quality: number;
  phase: number;
}

interface Props extends Values {
  onChange: (values: Values) => void;
}

export default class Controls extends Component<Props> {
  private _qualityRef = createRef<HTMLInputElement>();
  private _phaseRef = createRef<HTMLInputElement>();

  private _onChange = () => {
    this.props.onChange({
      quality: this._qualityRef.current!.valueAsNumber,
      phase: this._phaseRef.current!.valueAsNumber,
    });
  };

  render({ quality, phase }: Props) {
    return (
      <div class={$controls}>
        <div class={$ranges}>
          <label for="quality-range">Quality: </label>
          <input
            id="quality-range"
            ref={this._qualityRef}
            type="range"
            value={quality}
            min={1}
            max={100}
            onInput={this._onChange}
          />
          <label for="phase-range">Phase: </label>
          <input
            id="phase-range"
            ref={this._phaseRef}
            type="range"
            value={phase}
            min={0}
            max={63}
            onInput={this._onChange}
          />
        </div>
      </div>
    );
  }
}

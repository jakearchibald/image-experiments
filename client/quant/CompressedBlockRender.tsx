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
import { h, Component } from 'preact';
import BlockRender from './BlockRender';
import { inverseDCT, zigZag, inverseZigZag } from './jpeg-tools';

interface Props {
  dctData: number[];
  decodeTable: number[];
  start: number;
  end: number;
}

interface State {
  dctData?: number[];
  decodeTable?: number[];
  start?: number;
  end?: number;
  pixelData?: Uint8Array;
}

export default class CompressedBlockRender extends Component<Props, State> {
  state: State = {};

  static getDerivedStateFromProps(props: Props, state: State) {
    const propsChanged = !Object.entries(props).every(
      ([key, value]) => value === state[key as keyof Props],
    );

    if (!propsChanged) return null;

    const dct = props.dctData.slice();

    for (let i = 0; i < dct.length; i++) {
      if (i < props.start || i >= props.end) dct[inverseZigZag[i]] = 0;
    }

    const pixelData = new Uint8Array(8 * 8);
    inverseDCT(dct, props.decodeTable, pixelData);

    return { ...props, pixelData };
  }

  render({}: Props, { pixelData }: State) {
    return <BlockRender data={pixelData || new Uint8Array(8 * 8)} />;
  }
}

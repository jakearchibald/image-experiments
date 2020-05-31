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
import { $canvas } from 'shared/quant-styles/BlockRender.css';

interface Props {
  data: Uint8Array;
}

interface State {
  data?: Uint8Array;
  imageData?: ImageData;
}

export default class BlockRender extends Component<Props, State> {
  private _ctx?: CanvasRenderingContext2D;
  private _canvasRef = createRef<HTMLCanvasElement>();

  static getDerivedStateFromProps(
    props: Props,
    state: State,
  ): Partial<State> | null {
    if (props.data === state.data) return null;

    const imageData = new ImageData(8, 8);

    for (let i = 0; i < props.data.length; i++) {
      imageData.data[i * 4] = props.data[i];
      imageData.data[i * 4 + 1] = props.data[i];
      imageData.data[i * 4 + 2] = props.data[i];
      imageData.data[i * 4 + 3] = 255;
    }

    return {
      data: props.data,
      imageData,
    };
  }

  private _renderData() {
    this._ctx!.putImageData(this.state.imageData!, 0, 0);
  }

  componentDidMount() {
    this._ctx = this._canvasRef.current!.getContext('2d')!;
    this._renderData();
  }

  componentDidUpdate(previousProps: Props) {
    if (this.props.data !== previousProps.data) {
      this._renderData();
    }
  }

  render({}: Props) {
    return (
      <canvas class={$canvas} ref={this._canvasRef} width="8" height="8" />
    );
  }
}

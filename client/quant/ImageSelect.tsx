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

import {
  $canvas,
  $imageSelect,
  $select,
} from 'shared/quant-styles/ImageSelect.css';

const scale = 4;

interface Props {
  image: ImageBitmap;
  onSelect: (data: ImageData) => void;
}

interface State {
  selectX: number;
  selectY: number;
}

export default class ImageSelect extends Component<Props, State> {
  state: State = {
    selectX: 0,
    selectY: 0,
  };

  private _canvasRef = createRef<HTMLCanvasElement>();
  private _ctx?: CanvasRenderingContext2D;

  private _updateCanvas() {
    this._ctx = this._canvasRef.current!.getContext('2d')!;
    this._ctx.filter = 'grayscale(100%)';
    this._ctx.drawImage(this.props.image, 0, 0);
  }

  private _onMove = (event: MouseEvent) => {
    const bounds = (event.currentTarget as HTMLElement).getBoundingClientRect();

    this.setState({
      selectX: Math.floor((event.clientX - bounds.left) / scale / 8) * 8,
      selectY: Math.floor((event.clientY - bounds.top) / scale / 8) * 8,
    });
  };

  private _onClick = () => {
    this.props.onSelect(
      this._ctx!.getImageData(this.state.selectX, this.state.selectY, 8, 8),
    );
  };

  componentDidMount() {
    this._updateCanvas();
  }

  componentDidUpdate(previousProps: Props) {
    if (this.props.image !== previousProps.image) {
      this._updateCanvas();
    }
  }

  render({ image }: Props, { selectX, selectY }: State) {
    return (
      <div
        class={$imageSelect}
        onMouseMove={this._onMove}
        onClick={this._onClick}
      >
        <canvas
          ref={this._canvasRef}
          class={$canvas}
          width={image.width}
          height={image.height}
          style={{ width: image.width * scale, height: image.height * scale }}
        />
        <div
          class={$select}
          style={{
            '--scale': scale,
            top: selectY * scale + 'px',
            left: selectX * scale + 'px',
          }}
        ></div>
      </div>
    );
  }
}

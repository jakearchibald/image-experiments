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
import { h, Component, render } from 'preact';
import ChromaCanvas from './ChromaCanvas';

/*async function loadImage(url: string): Promise<ImageBitmap> {
  const blob = await fetch(url).then((r) => r.blob());
  return createImageBitmap(blob);
}*/

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

async function getResizedToWindow(mainBmp: ImageBitmap) {
  return resizeToBounds(
    mainBmp,
    window.innerWidth * devicePixelRatio,
    window.innerHeight * devicePixelRatio,
  );
}

async function getChannel(
  resizedBmp: ImageBitmap,
  factor: number,
): Promise<ImageBitmap> {
  return factor === 1
    ? resizedBmp
    : createImageBitmap(resizedBmp, {
        resizeWidth: Math.floor(resizedBmp.width * factor),
      });
}

interface State {
  mainBmp?: ImageBitmap;
  resizedBmp?: ImageBitmap;
  lumaBmp?: ImageBitmap;
  chromaBmp?: ImageBitmap;
  lumaMulti: number;
  chromaMulti: number;
}

class App extends Component<{}, State> {
  state: State = {
    lumaMulti: 1,
    chromaMulti: 0.01,
  };

  private _resizeTimeout: number = 0;

  private _onFileChange = async (event: Event) => {
    const input = event.target as HTMLInputElement;

    if (!input.files || !input.files[0]) return;

    const mainBmp = await createImageBitmap(input.files[0]);
    const resizedBmp = await getResizedToWindow(mainBmp);

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
  };

  private _onResize = () => {
    clearTimeout(this._resizeTimeout);

    this._resizeTimeout = setTimeout(async () => {
      if (!this.state.mainBmp) return;

      const resizedBmp = await getResizedToWindow(this.state.mainBmp);

      const [lumaBmp, chromaBmp] = await Promise.all([
        getChannel(resizedBmp, this.state.lumaMulti),
        getChannel(resizedBmp, this.state.chromaMulti),
      ]);

      this.setState({
        resizedBmp,
        lumaBmp,
        chromaBmp,
      });
    }, 500);
  };

  componentDidMount() {
    addEventListener('resize', this._onResize);
  }

  componentWillUnmount() {
    removeEventListener('resize', this._onResize);
  }

  render({}, { resizedBmp, lumaBmp, chromaBmp }: State) {
    return (
      <div>
        {resizedBmp && lumaBmp && chromaBmp && (
          <ChromaCanvas
            chromaBmp={chromaBmp}
            lumaBmp={lumaBmp}
            width={resizedBmp.width}
            height={resizedBmp.height}
          />
        )}
        <input type="file" onChange={this._onFileChange} />
      </div>
    );
  }
}

render(<App />, document.body);

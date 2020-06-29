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
import { h, Component, RenderableProps } from 'preact';

const allowedKeys = new Set(['Tab', 'Enter', ' ']);
const preventedKeys = new Set(['ArrowUp', 'ArrowDown']);

interface Props {
  onChange: (value: string) => void;
  value?: string;
}

export default class NavSelect extends Component<Props> {
  private _ignoreChange = false;

  private _onChange = (event: Event) => {
    if (this._ignoreChange) return;
    const target = event.target as HTMLSelectElement;
    this.props.onChange(target.value);
  };

  private _onKeyDown = ({ key }: KeyboardEvent) => {
    if (preventedKeys.has(key)) {
      this._ignoreChange = true;
    } else if (allowedKeys.has(key)) {
      this._ignoreChange = false;
    }
  };

  render({ children, value }: RenderableProps<Props>) {
    return (
      <select
        value={value}
        onChange={this._onChange}
        onKeyDown={this._onKeyDown}
      >
        {children}
      </select>
    );
  }
}

import { ToggleButton } from '../editor/button.js';
import Coord from '../editor/coord.js';
import Editor from '../editor/editor.js';
import {
    ChangeMode,
    ToolInterface,
    black,
    gray,
    red,
} from '../editor/tools.js';
import { Window } from '../editor/window.js';

function stringToArray(text: string): Array<number> {
    const array = new Array<number>();
    for (const char of text) {
        array.push(char.charCodeAt(0));
    }
    return array;
}

export default class PreviewTool implements ToolInterface {
    name = 'Preview';
    private readonly button = new ToggleButton('Preview Window');
    private readonly window = new Window(this);
    private readonly container = document.createElement('div');
    private readonly cursorDiv = document.createElement('div');
    private cursorPos = 0;
    private divs: Array<HTMLDivElement>;
    private canvases: Array<HTMLCanvasElement>;
    private readonly scale = 3;
    private chars = stringToArray(
        'THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG'
    );

    private updateText(index: number) {
        const div = this.divs[index]!;
        div.style.backgroundColor = black.toString();
        div.style.color = gray.toString();
        div.style.fontFamily = 'monospace';
        div.style.fontSize = '16px';
        div.style.textAlign = 'center';
        div.style.verticalAlign = 'middle';
        div.textContent = String.fromCharCode(this.chars[index]!);
    }

    constructor() {
        this.container.style.outline = 'none';
        this.container.style.position = 'relative';
        this.container.style.backgroundColor = black.toString();
        this.container.style.padding = '10px';
        this.cursorDiv.style.position = 'absolute';
        this.cursorDiv.style.border = `1px solid ${red.toString()}`;
        this.cursorDiv.style.boxSizing = 'border-box';
        this.cursorDiv.style.pointerEvents = 'none';
        this.cursorDiv.style.display = 'none';
        this.divs = new Array(this.chars.length);
        this.canvases = new Array(this.chars.length);
        for (let i = 0; i < this.chars.length; i++) {
            const div = document.createElement('div');
            this.divs[i] = div;
            this.updateText(i);
            this.container.appendChild(div);
            const canvas = document.createElement('canvas');
            canvas.style.imageRendering = 'pixelated';
            canvas.style.position = 'absolute';
            canvas.style.pointerEvents = 'none';
            this.canvases[i] = canvas;
            this.container.appendChild(canvas);
        }
        this.container.appendChild(this.cursorDiv);
        this.container.addEventListener('focus', (_event) => {
            this.cursorDiv.style.display = 'block';
        });
        this.container.addEventListener('blur', (_event) => {
            this.cursorDiv.style.display = 'none';
        });
        this.container.setAttribute('tabindex', '1');
        this.window.addElement(this.container);
    }

    init(editor: Editor): void {
        editor.addElementToDock(this.button.getDiv());
        this.button.addEventListener('click', () => {
            const toggled = this.button.getToggle();
            if (toggled) {
                this.button.setToggle(false);
                this.window.close();
            } else {
                this.button.setToggle(true);
                editor.addWindow(this.window);
            }
        });
        for (const [i, div] of this.divs.entries()) {
            div.addEventListener('pointerdown', () => {
                this.cursorPos = i;
                this.redrawCursor(editor);
            });
        }
        this.resize(editor);
        this.button.setToggle(true);
        editor.addWindow(this.window);
        this.window.moveToBottom(editor);
        this.container.addEventListener('keydown', (event) => {
            if (!event.metaKey && !event.ctrlKey && !event.altKey) {
                this.keyTyped(event.key, editor);
                event.stopPropagation();
            }
        });
    }

    private keyTyped(key: string, editor: Editor): void {
        if (key.length == 1) {
            const code = key.charCodeAt(0);
            if (code >= 32 && code <= 126) {
                this.chars[this.cursorPos] = code;
                this.updateText(this.cursorPos);
                this.update(this.cursorPos, editor);
                if (this.cursorPos < this.chars.length - 1) {
                    this.cursorPos += 1;
                    this.redrawCursor(editor);
                }
            }
        } else {
            switch (key) {
                case 'Backspace': {
                    if (this.cursorPos > 0) {
                        this.cursorPos -= 1;
                        this.chars[this.cursorPos] = ' '.charCodeAt(0);
                        this.updateText(this.cursorPos);
                        this.update(this.cursorPos, editor);
                        this.redrawCursor(editor);
                    }
                    break;
                }
                case 'Delete': {
                    this.chars[this.cursorPos] = ' '.charCodeAt(0);
                    this.updateText(this.cursorPos);
                    this.update(this.cursorPos, editor);
                    break;
                }
                case 'ArrowLeft': {
                    if (this.cursorPos > 0) {
                        this.cursorPos -= 1;
                        this.redrawCursor(editor);
                    }
                    break;
                }
                case 'ArrowRight': {
                    if (this.cursorPos < this.chars.length - 1) {
                        this.cursorPos += 1;
                        this.redrawCursor(editor);
                    }
                    break;
                }
                case 'Enter': {
                    editor.focus();
                    break;
                }
            }
        }
    }

    private update(index: number, editor: Editor): void {
        const char = this.chars[index]!;
        if (editor.hasAnyPixelsFor(char)) {
            this.canvases[index]!.style.display = 'block';
            const ctx = this.canvases[index]!.getContext('2d')!;
            const imageData = ctx.createImageData(editor.width, editor.height);
            imageData.data.set(editor.getRgbaDataFor(char)!);
            ctx.putImageData(imageData, 0, 0);
        } else {
            this.canvases[index]!.style.display = 'none';
        }
    }

    change(_coord: Coord, _from: boolean, editor: Editor): void {
        const code = editor.getCode();
        for (const [i, char] of this.chars.entries()) {
            if (code == char) {
                this.update(i, editor);
            }
        }
    }

    allChange(_from: boolean[], _mode: ChangeMode, editor: Editor): void {
        const code = editor.getCode();
        for (const [i, char] of this.chars.entries()) {
            if (code == char) {
                this.update(i, editor);
            }
        }
    }

    changeFont(_width: number, _height: number, editor: Editor): void {
        this.resize(editor);
    }

    private redrawCursor(editor: Editor): void {
        const width = editor.width;
        const height = editor.height;
        this.cursorDiv.style.width = `${width * this.scale}px`;
        this.cursorDiv.style.height = `${height * this.scale}px`;
        this.cursorDiv.style.top = '10px';
        this.cursorDiv.style.left = `${
            10 + this.cursorPos * width * this.scale
        }px`;
    }

    private resize(editor: Editor): void {
        const width = editor.width;
        const height = editor.height;
        this.container.style.width = `${
            width * this.chars.length * this.scale
        }px`;
        this.container.style.height = `${height * this.scale}px`;
        for (let i = 0; i < this.chars.length; i++) {
            const canvas = this.canvases[i]!;
            const div = this.divs[i]!;
            const x = i % this.chars.length;
            const y = Math.floor(i / this.chars.length);
            canvas.width = width;
            canvas.height = height;
            canvas.style.width = `${width * this.scale}px`;
            canvas.style.height = `${height * this.scale}px`;
            canvas.style.top = `${10 + y * height * this.scale}px`;
            canvas.style.left = `${10 + x * width * this.scale}px`;
            div.style.lineHeight = `${height * this.scale}px`;
            div.style.position = 'absolute';
            div.style.width = `${width * this.scale}px`;
            div.style.height = `${height * this.scale}px`;
            div.style.top = `${10 + y * height * this.scale}px`;
            div.style.left = `${10 + x * width * this.scale}px`;
            this.update(i, editor);
        }
        this.redrawCursor(editor);
    }

    addTo(div: HTMLDivElement): void {
        this.window.addTo(div);
    }

    close(): void {
        this.button.setToggle(false);
        this.window.remove();
    }
}

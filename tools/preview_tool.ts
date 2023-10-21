import { ToggleButton } from '../editor/button.js';
import Coord from '../editor/coord.js';
import Editor from '../editor/editor.js';
import { ChangeMode, ToolInterface, black, gray } from '../editor/tools.js';
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
    private readonly button = new ToggleButton('Preview');
    private readonly window = new Window(this);
    private readonly container = document.createElement('div');
    private divs: Array<HTMLDivElement>;
    private canvases: Array<HTMLCanvasElement>;
    private readonly scale = 3;
    private chars = stringToArray(
        'The quick brown fox jumps over the lazy dog'
    );

    constructor() {
        this.container.style.position = 'relative';
        this.container.style.backgroundColor = black.toString();
        this.container.style.padding = '10px';
        this.divs = new Array(this.chars.length);
        this.canvases = new Array(this.chars.length);
        for (let i = 0; i < this.chars.length; i++) {
            const div = document.createElement('div');
            div.style.backgroundColor = black.toString();
            div.style.color = gray.toString();
            div.style.fontFamily = 'monospace';
            div.style.fontSize = '16px';
            div.style.textAlign = 'center';
            div.style.verticalAlign = 'middle';
            div.style.lineHeight = '1em';
            div.textContent = String.fromCharCode(this.chars[i]!);
            this.divs[i] = div;
            this.container.appendChild(div);
            const canvas = document.createElement('canvas');
            canvas.style.imageRendering = 'pixelated';
            canvas.style.position = 'absolute';
            canvas.style.top = '0';
            canvas.style.left = '0';
            canvas.style.width = '100%';
            canvas.style.height = '100%';
            this.canvases[i] = canvas;
            div.appendChild(canvas);
        }
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
        this.resize(editor);
        this.button.setToggle(true);
        editor.addWindow(this.window);
        this.window.moveToBottom(editor);
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

    private redraw(editor: Editor): void {
        for (let i = 0; i < this.chars.length; i++) {
            this.update(i, editor);
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
            div.style.width = `${width * this.scale}px`;
            div.style.height = `${height * this.scale}px`;
            div.style.position = 'absolute';
            div.style.top = `${10 + y * height * this.scale}px`;
            div.style.left = `${10 + x * width * this.scale}px`;
            this.redraw(editor);
        }
    }

    addTo(div: HTMLDivElement): void {
        this.window.addTo(div);
    }

    close(): void {
        this.button.setToggle(false);
        this.window.remove();
    }

    onEnable() {
        console.log('Preview enabled');
    }

    onDisable() {
        console.log('Preview disabled');
    }
}

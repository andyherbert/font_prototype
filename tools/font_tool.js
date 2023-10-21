import { Encoding, getDefinitions, black, gray, white, } from '../editor/tools.js';
import { Button, ToggleButton } from '../editor/button.js';
import { Window } from '../editor/window.js';
class FontWindow {
    window = new Window(this);
    button;
    div = document.createElement('div');
    canvas = document.createElement('canvas');
    selectedDiv = document.createElement('div');
    canvases = new Array();
    scale = 2;
    constructor(button) {
        this.button = button;
        this.div.style.position = 'relative';
        this.div.style.backgroundColor = 'red';
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0px';
        this.canvas.style.left = '0px';
        this.canvas.style.imageRendering = 'pixelated';
        this.div.appendChild(this.canvas);
        this.window.addElement(this.div);
        this.selectedDiv.style.position = 'absolute';
        this.selectedDiv.style.border = `1px solid ${white.toString()}`;
        this.selectedDiv.style.borderRadius = '2px';
        this.div.appendChild(this.selectedDiv);
        for (let i = 0; i < 256; i++) {
            const canvas = document.createElement('canvas');
            canvas.style.position = 'absolute';
            canvas.style.imageRendering = 'pixelated';
            canvas.style.pointerEvents = 'none';
            this.canvases.push(canvas);
            this.div.appendChild(canvas);
        }
    }
    getCanvas() {
        return this.canvas;
    }
    addTo(div) {
        this.window.addTo(div);
    }
    moveToLeft(editor) {
        this.window.moveToLeft(editor);
    }
    close() {
        this.window.remove();
        this.button.setToggle(false);
    }
    redraw(editor) {
        const width = (editor.width * 16 + 16) * this.scale;
        const height = (editor.height * 16 + 16) * this.scale;
        this.div.style.width = `${width}px`;
        this.div.style.height = `${height}px`;
        this.canvas.height = height;
        this.canvas.width = width;
        const ctx = this.canvas.getContext('2d');
        if (ctx != null) {
            ctx.fillStyle = black.toString();
            ctx.fillRect(0, 0, width, height);
            const imageDataHorizontal = ctx.createImageData(width, 1);
            for (let i = 0; i < width * 4; i += 4) {
                if (i % 8 == 0) {
                    imageDataHorizontal.data.set(gray.rgbaData, i);
                }
                else {
                    imageDataHorizontal.data.set(black.rgbaData, i);
                }
            }
            for (let y = (editor.height + 1) * this.scale; y < height; y += (editor.height + 1) * this.scale) {
                ctx.putImageData(imageDataHorizontal, 0, y);
            }
            const imageDataVertical = ctx.createImageData(1, height);
            for (let i = 0; i < height * 4; i += 4) {
                if (i % 8 == 0) {
                    imageDataVertical.data.set(gray.rgbaData, i);
                }
                else {
                    imageDataVertical.data.set(black.rgbaData, i);
                }
            }
            for (let x = (editor.width + 1) * this.scale; x < width; x += (editor.width + 1) * this.scale) {
                ctx.putImageData(imageDataVertical, x, 0);
            }
            ctx.font = '13px ui-monospace, monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = gray.toString();
            let code = 0;
            const definitions = getDefinitions(editor.getEncoding());
            for (let y = 0; y < 16; y += 1) {
                for (let x = 0; x < 16; x += 1) {
                    const char = definitions[code].char;
                    if (char != null) {
                        const px = Math.floor((x + 0.5) * editor.width * this.scale) +
                            x * this.scale +
                            1;
                        const py = Math.floor((y + 0.5) * editor.height * this.scale) +
                            y * this.scale +
                            2;
                        ctx.fillText(char, px, py);
                    }
                    const canvas = this.canvases[code];
                    canvas.width = editor.width;
                    canvas.height = editor.height;
                    canvas.style.width = `${editor.width * this.scale}px`;
                    canvas.style.height = `${editor.height * this.scale}px`;
                    canvas.style.left = `${(x * (editor.width + 1) + 1) * this.scale}px`;
                    canvas.style.top = `${(y * (editor.height + 1) + 1) * this.scale}px`;
                    this.updateGlyph(code, editor);
                    code += 1;
                }
            }
        }
    }
    moveToRight(editor) {
        this.window.moveToRight(editor);
    }
    updateGlyph(code, editor) {
        const canvas = this.canvases[code];
        if (editor.hasAnyPixelsFor(code)) {
            canvas.style.opacity = '1';
            const ctx = canvas.getContext('2d');
            const imageData = ctx.createImageData(canvas.width, canvas.height);
            imageData.data.set(editor.getRgbaDataFor(code));
            ctx.putImageData(imageData, 0, 0);
        }
        else {
            canvas.style.opacity = '0';
        }
    }
    change(editor) {
        this.updateGlyph(editor.getCode(), editor);
    }
    setCode(code, editor) {
        const x = code % 16;
        const y = Math.floor(code / 16);
        const px = x * (editor.width + 1) * this.scale;
        const py = y * (editor.height + 1) * this.scale;
        this.selectedDiv.style.left = `${px}px`;
        this.selectedDiv.style.top = `${py}px`;
        this.selectedDiv.style.width = `${(editor.width + 1) * this.scale}px`;
        this.selectedDiv.style.height = `${(editor.height + 1) * this.scale}px`;
    }
}
export default class FontTool {
    name = 'Font';
    shortcuts = [
        { code: 'KeyE', cmd: true, shift: false, repeat: false },
        { code: 'KeyF', cmd: true, shift: false, repeat: false },
    ];
    button = new ToggleButton('Font');
    encodingButton = new Button('');
    window = new FontWindow(this.button);
    init(editor) {
        this.button.addEventListener('pointerdown', () => {
            this.fontButtonClick(editor);
        });
        editor.addElementToDock(this.button.getDiv());
        editor.addElementToDock(this.encodingButton.getDiv());
        this.encodingButton.addEventListener('pointerdown', () => {
            this.encodingButtonClick(editor);
        });
        this.window.redraw(editor);
        const canvas = this.window.getCanvas();
        canvas.addEventListener('pointerdown', (event) => {
            const rect = canvas.getBoundingClientRect();
            const fontWidth = rect.width / 16;
            const fontHeight = rect.height / 16;
            const x = Math.floor((event.clientX - rect.left) / fontWidth);
            const y = Math.floor((event.clientY - rect.top) / fontHeight);
            editor.setCode(x + y * 16);
        });
        this.fontButtonClick(editor);
        this.window.moveToRight(editor);
    }
    fontButtonClick(editor) {
        const toggled = this.button.getToggle();
        if (toggled) {
            this.window.close();
            this.button.setToggle(false);
        }
        else {
            editor.addWindow(this.window);
            this.button.setToggle(true);
        }
    }
    encodingButtonClick(editor) {
        this.encodingButton.flash();
        const encoding = editor.getEncoding();
        switch (encoding) {
            case Encoding.Ascii:
                editor.setEncoding(Encoding.Iso8859_1);
                break;
            case Encoding.Iso8859_1:
                editor.setEncoding(Encoding.Iso8859_15);
                break;
            case Encoding.Iso8859_15:
                editor.setEncoding(Encoding.MacRoman);
                break;
            case Encoding.MacRoman:
                editor.setEncoding(Encoding.Windows1252);
                break;
            case Encoding.Windows1252:
                editor.setEncoding(Encoding.Ascii);
                break;
        }
    }
    keyDown(key, editor) {
        switch (key.code) {
            case 'KeyE':
                this.encodingButtonClick(editor);
                return false;
            case 'KeyF':
                this.fontButtonClick(editor);
                return false;
        }
        return false;
    }
    setEncoding(encoding, editor) {
        const code = editor.getCode();
        const definitions = getDefinitions(encoding);
        editor.setHeader(definitions[code].name);
        this.encodingButton.setText(encoding);
        this.window.redraw(editor);
    }
    setCode(code, editor) {
        this.window.setCode(code, editor);
        this.setEncoding(editor.getEncoding(), editor);
    }
    change(_coord, _from, editor) {
        if (this.button.getToggle()) {
            this.window.change(editor);
        }
    }
    allChange(_from, _mode, editor) {
        if (this.button.getToggle()) {
            this.window.change(editor);
        }
    }
    changeFont(_width, _height, editor) {
        this.window.redraw(editor);
        this.window.setCode(editor.getCode(), editor);
    }
}
//# sourceMappingURL=font_tool.js.map
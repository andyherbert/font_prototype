import { black, white } from '../editor/tools.js';
export default class CanvasTool {
    name = 'Canvas';
    canvas = document.createElement('canvas');
    ctx = null;
    imageData = null;
    redraw(editor) {
        for (const [coord, pixel] of editor.enumeratePixels()) {
            if (pixel) {
                this.set(coord);
            }
            else {
                this.erase(coord);
            }
        }
    }
    init(editor) {
        this.canvas.width = editor.width;
        this.canvas.height = editor.height;
        this.ctx = this.canvas.getContext('2d', {
            alpha: false,
            willReadFrequently: true,
        });
        if (this.ctx != null) {
            this.imageData = this.ctx.createImageData(editor.width, editor.height);
            editor.addOverlay(this.canvas);
            this.redraw(editor);
        }
    }
    rect(coord, color) {
        if (this.ctx != null && this.imageData != null) {
            this.imageData.data.set(color.rgbaData, coord.toIndex(this.canvas.width) * 4);
            this.ctx.putImageData(this.imageData, 0, 0);
        }
    }
    set(coord) {
        this.rect(coord, white);
    }
    erase(coord) {
        this.rect(coord, black);
    }
    change(coord, from, _editor) {
        if (from) {
            this.erase(coord);
        }
        else {
            this.set(coord);
        }
    }
    allChange(_from, _undo, editor) {
        this.redraw(editor);
    }
    setCode(_code, editor) {
        this.redraw(editor);
    }
}
//# sourceMappingURL=canvas_tool.js.map
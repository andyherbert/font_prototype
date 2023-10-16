import Editor from '../editor/editor.js';
import { ChangeMode, ToolInterface, black, white } from '../editor/tools.js';
import Color from '../editor/color.js';
import Coord from '../editor/coord.js';

export default class CanvasTool implements ToolInterface {
    readonly name = 'Canvas';
    private readonly canvas = document.createElement('canvas');
    private ctx: CanvasRenderingContext2D | null = null;
    private imageData: ImageData | null = null;

    private redraw(editor: Editor): void {
        for (const [coord, pixel] of editor.enumeratePixels()) {
            if (pixel) {
                this.set(coord);
            } else {
                this.erase(coord);
            }
        }
    }

    init(editor: Editor): void {
        this.canvas.width = editor.width;
        this.canvas.height = editor.height;
        this.ctx = this.canvas.getContext('2d', {
            alpha: false,
            willReadFrequently: true,
        });
        if (this.ctx != null) {
            this.imageData = this.ctx.createImageData(
                editor.width,
                editor.height
            );
            editor.addOverlay(this.canvas);
            this.redraw(editor);
        }
    }

    private rect(coord: Coord, color: Color): void {
        if (this.ctx != null && this.imageData != null) {
            this.imageData.data.set(
                color.rgbaData,
                coord.toIndex(this.canvas.width) * 4
            );
            this.ctx.putImageData(this.imageData, 0, 0);
        }
    }

    private set(coord: Coord): void {
        this.rect(coord, white);
    }

    private erase(coord: Coord): void {
        this.rect(coord, black);
    }

    change(coord: Coord, from: boolean, _editor: Editor): void {
        if (from) {
            this.erase(coord);
        } else {
            this.set(coord);
        }
    }

    allChange(_from: boolean[], _undo: ChangeMode, editor: Editor): void {
        this.redraw(editor);
    }
}

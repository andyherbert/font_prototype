import { Button } from '../editor/button.js';
import Coord from '../editor/coord.js';
import Editor from '../editor/editor.js';
import { ToolInterface } from '../editor/tools.js';

function* plotLineLow(from: Coord, to: Coord): IterableIterator<Coord> {
    const dx = to.x - from.x;
    let dy = to.y - from.y;
    let yi = 1;
    if (dy < 0) {
        yi = -1;
        dy = -dy;
    }
    let D = 2 * dy - dx;
    let y = from.y;
    for (let x = from.x; x <= to.x; x++) {
        yield new Coord(x, y);
        if (D > 0) {
            y = y + yi;
            D = D + 2 * (dy - dx);
        } else {
            D = D + 2 * dy;
        }
    }
}

function* plotLineHigh(from: Coord, to: Coord): IterableIterator<Coord> {
    let dx = to.x - from.x;
    const dy = to.y - from.y;
    let xi = 1;
    if (dx < 0) {
        xi = -1;
        dx = -dx;
    }
    let D = 2 * dx - dy;
    let x = from.x;
    for (let y = from.y; y <= to.y; y++) {
        yield new Coord(x, y);
        if (D > 0) {
            x = x + xi;
            D = D + 2 * (dx - dy);
        } else {
            D = D + 2 * dx;
        }
    }
}

function line(from: Coord, to: Coord): IterableIterator<Coord> {
    if (Math.abs(to.y - from.y) < Math.abs(to.x - from.x)) {
        if (from.x > to.x) {
            return plotLineLow(to, from);
        } else {
            return plotLineLow(from, to);
        }
    } else {
        if (from.y > to.y) {
            return plotLineHigh(to, from);
        } else {
            return plotLineHigh(from, to);
        }
    }
}

enum PixelToolMode {
    Draw,
    Erase,
}

export default class PixelTool implements ToolInterface {
    readonly name = 'Pixel';
    readonly cursor = 'crosshair';
    readonly shortcuts = [
        { code: 'KeyP', cmd: true, shift: false, repeat: false },
    ];
    private start: Coord | null = null;
    private mode: PixelToolMode | null = null;
    private readonly button = new Button('Pixel');

    init(editor: Editor): void {
        editor.addElementToDock(this.button.getDiv());
        this.button.addEventListener('pointerdown', () => {
            editor.setTool(this);
        });
    }

    focus(_editor: Editor): void {
        this.button.focus();
    }

    blur(_editor: Editor): void {
        this.button.blur();
        this.start = null;
    }

    private draw(coord: Coord, editor: Editor): void {
        if (this.mode == PixelToolMode.Draw) {
            editor.setPixel(coord, true);
        } else if (this.mode == PixelToolMode.Erase) {
            editor.setPixel(coord, false);
        }
    }

    pointerDown(coord: Coord, editor: Editor): void {
        if (coord.withinBounds(editor.width, editor.height)) {
            const pixel = editor.getPixel(coord);
            if (pixel) {
                this.mode = PixelToolMode.Erase;
            } else {
                this.mode = PixelToolMode.Draw;
            }
            this.draw(coord, editor);
            this.start = coord;
        }
    }

    pointerMove(coord: Coord, editor: Editor): void {
        if (this.start?.neq(coord)) {
            for (const lineCoord of line(this.start, coord)) {
                this.draw(lineCoord, editor);
            }
            this.start = coord;
        }
    }

    pointerUp(editor: Editor): void {
        this.start = null;
        editor.endChange();
    }
}

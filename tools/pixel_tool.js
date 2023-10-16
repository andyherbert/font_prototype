import Button from './button.js';
import Coord from '../editor/coord.js';
function* plotLineLow(from, to) {
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
        }
        else {
            D = D + 2 * dy;
        }
    }
}
function* plotLineHigh(from, to) {
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
        }
        else {
            D = D + 2 * dx;
        }
    }
}
function line(from, to) {
    if (Math.abs(to.y - from.y) < Math.abs(to.x - from.x)) {
        if (from.x > to.x) {
            return plotLineLow(to, from);
        }
        else {
            return plotLineLow(from, to);
        }
    }
    else {
        if (from.y > to.y) {
            return plotLineHigh(to, from);
        }
        else {
            return plotLineHigh(from, to);
        }
    }
}
var PixelToolMode;
(function (PixelToolMode) {
    PixelToolMode[PixelToolMode["Draw"] = 0] = "Draw";
    PixelToolMode[PixelToolMode["Erase"] = 1] = "Erase";
})(PixelToolMode || (PixelToolMode = {}));
export default class PixelTool {
    name = 'Pixel';
    cursor = 'crosshair';
    shortcuts = [
        { code: 'KeyP', cmd: false, shift: false, repeat: false },
    ];
    start = null;
    mode = null;
    button = new Button('Pixel');
    init(editor) {
        editor.addElementToDock(this.button.getDiv());
        this.button.addEventListener('pointerdown', () => {
            editor.setTool(this);
        });
    }
    focus(_editor) {
        this.button.focus();
    }
    blur(_editor) {
        this.button.blur();
        this.start = null;
    }
    draw(coord, editor) {
        if (this.mode == PixelToolMode.Draw) {
            editor.setPixel(coord, true);
        }
        else if (this.mode == PixelToolMode.Erase) {
            editor.setPixel(coord, false);
        }
    }
    pointerDown(coord, editor) {
        if (coord.withinBounds(editor.width, editor.height)) {
            const pixel = editor.getPixel(coord);
            if (pixel) {
                this.mode = PixelToolMode.Erase;
            }
            else {
                this.mode = PixelToolMode.Draw;
            }
            this.draw(coord, editor);
            this.start = coord;
        }
    }
    pointerMove(coord, editor) {
        if (this.start?.neq(coord)) {
            for (const lineCoord of line(this.start, coord)) {
                this.draw(lineCoord, editor);
            }
            this.start = coord;
        }
    }
    pointerUp(editor) {
        this.start = null;
        editor.endChange();
    }
}
//# sourceMappingURL=pixel_tool.js.map
import Coord from '../editor/coord.js';
import { Button, QuadButton } from '../editor/button.js';
export default class MoveTool {
    name = 'Move';
    cursor = 'grab';
    shortcuts = [
        { code: 'ArrowUp', cmd: true, shift: false, repeat: true },
        { code: 'ArrowDown', cmd: true, shift: false, repeat: true },
        { code: 'ArrowLeft', cmd: true, shift: false, repeat: true },
        { code: 'ArrowRight', cmd: true, shift: false, repeat: true },
        { code: 'KeyM', cmd: true, shift: true, repeat: false },
    ];
    start = null;
    button = new Button('Move');
    quad = new QuadButton(['Up', 'Down', 'Left', 'Right']);
    init(editor) {
        editor.addElementToDock(this.button.getDiv());
        this.button.addEventListener('pointerdown', () => {
            editor.setTool(this);
        });
        editor.addElementToDock(this.quad.getDiv());
        this.quad.addEventListener(0, 'pointerdown', () => {
            this.moveUp(editor);
        });
        this.quad.addEventListener(1, 'pointerdown', () => {
            this.moveDown(editor);
        });
        this.quad.addEventListener(2, 'pointerdown', () => {
            this.moveLeft(editor);
        });
        this.quad.addEventListener(3, 'pointerdown', () => {
            this.moveRight(editor);
        });
    }
    focus(_editor) {
        this.button.focus();
    }
    keyDown(key, editor) {
        switch (key.code) {
            case 'ArrowUp': {
                this.moveUp(editor);
                return false;
            }
            case 'ArrowDown': {
                this.moveDown(editor);
                return false;
            }
            case 'ArrowLeft': {
                this.moveLeft(editor);
                return false;
            }
            case 'ArrowRight': {
                this.moveRight(editor);
                return false;
            }
            case 'KeyM': {
                return true;
            }
        }
        return false;
    }
    pointerDown(coord, editor) {
        if (coord.withinBounds(editor.width, editor.height)) {
            this.start = coord;
        }
    }
    pointerMove(coord, editor) {
        if (this.start?.neq(coord)) {
            const delta = coord.minus(this.start);
            for (let i = 0; i < Math.abs(delta.x); i += 1) {
                if (delta.x > 0) {
                    this.moveRight(editor);
                }
                else {
                    this.moveLeft(editor);
                }
            }
            for (let i = 0; i < Math.abs(delta.y); i += 1) {
                if (delta.y > 0) {
                    this.moveDown(editor);
                }
                else {
                    this.moveUp(editor);
                }
            }
            this.start = coord;
        }
    }
    pointerUp(_editor) {
        this.start = null;
    }
    blur(_editor) {
        this.start = null;
        this.button.blur();
    }
    moveUp(editor) {
        const pixels = editor.getData();
        for (const [from, pixel] of editor.enumeratePixels()) {
            const to = new Coord(from.x, from.y == 0 ? editor.height - 1 : from.y - 1);
            pixels[to.toIndex(editor.width)] = pixel;
        }
        editor.setData(pixels);
        this.quad.flash(0);
    }
    moveDown(editor) {
        const pixels = editor.getData();
        for (const [from, pixel] of editor.enumeratePixels()) {
            const to = new Coord(from.x, from.y == editor.height - 1 ? 0 : from.y + 1);
            pixels[to.toIndex(editor.width)] = pixel;
        }
        editor.setData(pixels);
        this.quad.flash(1);
    }
    moveLeft(editor) {
        const pixels = editor.getData();
        for (const [from, pixel] of editor.enumeratePixels()) {
            const to = new Coord(from.x == 0 ? editor.width - 1 : from.x - 1, from.y);
            pixels[to.toIndex(editor.width)] = pixel;
        }
        editor.setData(pixels);
        this.quad.flash(2);
    }
    moveRight(editor) {
        const pixels = editor.getData();
        for (const [from, pixel] of editor.enumeratePixels()) {
            const to = new Coord(from.x == editor.width - 1 ? 0 : from.x + 1, from.y);
            pixels[to.toIndex(editor.width)] = pixel;
        }
        editor.setData(pixels);
        this.quad.flash(3);
    }
}
//# sourceMappingURL=move_tool.js.map
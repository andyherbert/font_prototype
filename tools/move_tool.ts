import Editor from '../editor/editor.js';
import { Key, ToolInterface } from '../editor/tools.js';

import Coord from '../editor/coord.js';

export default class MoveTool implements ToolInterface {
    readonly name = 'Move';
    readonly cursor = 'grab';
    readonly shortcuts = [
        { code: 'ArrowUp', cmd: false, shift: false, repeat: true },
        { code: 'ArrowDown', cmd: false, shift: false, repeat: true },
        { code: 'ArrowLeft', cmd: false, shift: false, repeat: true },
        { code: 'ArrowRight', cmd: false, shift: false, repeat: true },
        { code: 'KeyM', cmd: false, shift: false, repeat: false },
    ];
    private start: Coord | null = null;

    keyDown(key: Key, editor: Editor): boolean {
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

    pointerDown(coord: Coord, editor: Editor): void {
        if (coord.withinBounds(editor.width, editor.height)) {
            this.start = coord;
        }
    }

    pointerMove(coord: Coord, editor: Editor): void {
        if (this.start?.neq(coord)) {
            const delta = coord.minus(this.start);
            for (let i = 0; i < Math.abs(delta.x); i += 1) {
                if (delta.x > 0) {
                    this.moveRight(editor);
                } else {
                    this.moveLeft(editor);
                }
            }
            for (let i = 0; i < Math.abs(delta.y); i += 1) {
                if (delta.y > 0) {
                    this.moveDown(editor);
                } else {
                    this.moveUp(editor);
                }
            }
            this.start = coord;
        }
    }

    pointerUp(_editor: Editor): void {
        this.start = null;
    }

    blur(_editor: Editor): void {
        this.start = null;
    }

    private moveUp(editor: Editor): void {
        const pixels = editor.getData();
        for (const [from, pixel] of editor.enumeratePixels()) {
            const to = new Coord(
                from.x,
                from.y == 0 ? editor.height - 1 : from.y - 1
            );
            pixels[to.toIndex(editor.width)] = pixel;
        }
        editor.setData(pixels);
    }

    private moveDown(editor: Editor): void {
        const pixels = editor.getData();
        for (const [from, pixel] of editor.enumeratePixels()) {
            const to = new Coord(
                from.x,
                from.y == editor.height - 1 ? 0 : from.y + 1
            );
            pixels[to.toIndex(editor.width)] = pixel;
        }
        editor.setData(pixels);
    }

    private moveLeft(editor: Editor): void {
        const pixels = editor.getData();
        for (const [from, pixel] of editor.enumeratePixels()) {
            const to = new Coord(
                from.x == 0 ? editor.width - 1 : from.x - 1,
                from.y
            );
            pixels[to.toIndex(editor.width)] = pixel;
        }
        editor.setData(pixels);
    }

    private moveRight(editor: Editor): void {
        const pixels = editor.getData();
        for (const [from, pixel] of editor.enumeratePixels()) {
            const to = new Coord(
                from.x == editor.width - 1 ? 0 : from.x + 1,
                from.y
            );
            pixels[to.toIndex(editor.width)] = pixel;
        }
        editor.setData(pixels);
    }
}

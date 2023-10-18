import { Button } from '../editor/button.js';
import Coord from '../editor/coord.js';
import Editor from '../editor/editor.js';
import { ChangeMode, isMac, Key, ToolInterface } from '../editor/tools.js';

class Buffers {
    undo: Array<Map<number, [Coord, boolean]> | Array<boolean>> = new Array();
    redo: Array<Map<number, [Coord, boolean]> | Array<boolean>> = new Array();
    change: Map<number, [Coord, boolean]> = new Map();
}

export default class UndoTool implements ToolInterface {
    readonly name = 'Undo';
    readonly shortcuts = isMac
        ? [
              { code: 'KeyZ', cmd: true, shift: false, repeat: true },
              { code: 'KeyZ', cmd: true, shift: true, repeat: true },
          ]
        : [
              { code: 'KeyZ', cmd: true, shift: false, repeat: true },
              { code: 'KeyY', cmd: true, shift: false, repeat: true },
          ];
    private buffers: Array<Buffers>;
    private currentCode = 0;
    private readonly undoButton = new Button('Undo');
    private readonly redoButton = new Button('Redo');

    constructor() {
        this.buffers = new Array();
        for (let i = 0; i < 256; i++) {
            this.buffers.push(new Buffers());
        }
    }

    init(editor: Editor): void {
        editor.addElementToDock(this.undoButton.getDiv());
        editor.addElementToDock(this.redoButton.getDiv());
        this.undoButton.addEventListener('pointerdown', () => {
            this.doUndo(editor);
        });
        this.redoButton.addEventListener('pointerdown', () => {
            this.doRedo(editor);
        });
    }

    private processChangeBuffer(
        editor: Editor,
        buffer: Map<number, [Coord, boolean]> | Array<boolean>,
        mode: ChangeMode
    ): void {
        if (buffer instanceof Array) {
            editor.setData(buffer, mode);
        } else {
            for (const [coord, pixel] of buffer.values()) {
                editor.setPixel(coord, pixel);
            }
            editor.endChange(mode);
        }
    }

    private doUndo(editor: Editor): void {
        const buffer = this.buffers[this.currentCode]!.undo.pop();
        if (buffer != null) {
            this.processChangeBuffer(editor, buffer, ChangeMode.Undo);
            this.undoButton.flash();
        }
    }

    private doRedo(editor: Editor): void {
        const buffer = this.buffers[this.currentCode]!.redo.pop();
        if (buffer != null) {
            this.processChangeBuffer(editor, buffer, ChangeMode.Redo);
            this.redoButton.flash();
        }
    }

    keyDown(key: Key, editor: Editor): boolean {
        if (isMac) {
            if (key.shift) {
                this.doRedo(editor);
            } else {
                this.doUndo(editor);
            }
        } else {
            if (key.code == 'KeyY') {
                this.doRedo(editor);
            } else {
                this.doUndo(editor);
            }
        }
        return false;
    }

    change(coord: Coord, from: boolean, editor: Editor): void {
        const buffer = this.buffers[this.currentCode]!;
        if (!buffer.change.has(coord.toIndex(editor.width))) {
            buffer.change.set(coord.toIndex(editor.width), [coord, from]);
        }
    }

    private clearRedoBuffer(): void {
        const buffer = this.buffers[this.currentCode]!;
        if (buffer.redo.length > 0) {
            buffer.redo = new Array();
        }
    }

    allChange(from: boolean[], mode: ChangeMode, _editor: Editor): void {
        const buffer = this.buffers[this.currentCode]!;
        switch (mode) {
            case ChangeMode.Edit: {
                buffer.undo.push(from);
                this.clearRedoBuffer();
                break;
            }
            case ChangeMode.Undo: {
                buffer.redo.push(from);
                break;
            }
            case ChangeMode.Redo: {
                buffer.undo.push(from);
                break;
            }
        }
    }

    endChange(mode: ChangeMode, _editor: Editor): void {
        const buffer = this.buffers[this.currentCode]!;
        if (buffer.change.size > 0) {
            switch (mode) {
                case ChangeMode.Edit: {
                    buffer.undo.push(buffer.change);
                    this.clearRedoBuffer();
                    break;
                }
                case ChangeMode.Undo: {
                    buffer.redo.push(buffer.change);
                    break;
                }
                case ChangeMode.Redo: {
                    buffer.undo.push(buffer.change);
                    break;
                }
            }
            buffer!.change = new Map();
        }
    }

    setCode(code: number, _editor: Editor): void {
        this.currentCode = code;
    }
}

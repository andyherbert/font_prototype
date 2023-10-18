import { Button } from '../editor/button.js';
import Coord from '../editor/coord.js';
import Editor from '../editor/editor.js';
import { ChangeMode, isMac, Key, ToolInterface } from '../editor/tools.js';

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
    private changeBuffer: Map<number, [Coord, boolean]> = new Map();
    private undoBuffer: Array<Map<number, [Coord, boolean]> | Array<boolean>> =
        new Array();
    private redoBuffer: Array<Map<number, [Coord, boolean]> | Array<boolean>> =
        new Array();
    private readonly undoButton = new Button('Undo');
    private readonly redoButton = new Button('Redo');

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
        const buffer = this.undoBuffer.pop();
        if (buffer != null) {
            this.processChangeBuffer(editor, buffer, ChangeMode.Undo);
            this.undoButton.flash();
        }
    }

    private doRedo(editor: Editor): void {
        const buffer = this.redoBuffer.pop();
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
        if (!this.changeBuffer.has(coord.toIndex(editor.width))) {
            this.changeBuffer.set(coord.toIndex(editor.width), [coord, from]);
        }
    }

    private clearRedoBuffer(): void {
        if (this.redoBuffer.length > 0) {
            this.redoBuffer = new Array();
        }
    }

    allChange(from: boolean[], mode: ChangeMode, _editor: Editor): void {
        switch (mode) {
            case ChangeMode.Edit: {
                this.undoBuffer.push(from);
                this.clearRedoBuffer();
                break;
            }
            case ChangeMode.Undo: {
                this.redoBuffer.push(from);
                break;
            }
            case ChangeMode.Redo: {
                this.undoBuffer.push(from);
                break;
            }
        }
    }

    endChange(_editor: Editor, mode: ChangeMode): void {
        if (this.changeBuffer.size > 0) {
            switch (mode) {
                case ChangeMode.Edit: {
                    this.undoBuffer.push(this.changeBuffer);
                    this.clearRedoBuffer();
                    break;
                }
                case ChangeMode.Undo: {
                    this.redoBuffer.push(this.changeBuffer);
                    break;
                }
                case ChangeMode.Redo: {
                    this.undoBuffer.push(this.changeBuffer);
                    break;
                }
            }
            this.changeBuffer = new Map();
        }
    }
}

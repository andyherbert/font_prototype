import Button from './button.js';
import { ChangeMode, isMac } from '../editor/tools.js';
export default class UndoTool {
    name = 'Undo';
    shortcuts = isMac
        ? [
            { code: 'KeyZ', cmd: true, shift: false, repeat: true },
            { code: 'KeyZ', cmd: true, shift: true, repeat: true },
        ]
        : [
            { code: 'KeyZ', cmd: true, shift: false, repeat: true },
            { code: 'KeyY', cmd: true, shift: false, repeat: true },
        ];
    changeBuffer = new Map();
    undoBuffer = new Array();
    redoBuffer = new Array();
    undoButton = new Button('Undo');
    redoButton = new Button('Redo');
    init(editor) {
        editor.addElementToDock(this.undoButton.getDiv());
        editor.addElementToDock(this.redoButton.getDiv());
        this.undoButton.addEventListener('pointerdown', () => {
            this.doUndo(editor);
        });
        this.redoButton.addEventListener('pointerdown', () => {
            this.doRedo(editor);
        });
    }
    processChangeBuffer(editor, buffer, mode) {
        if (buffer instanceof Array) {
            editor.setData(buffer, mode);
        }
        else {
            for (const [coord, pixel] of buffer.values()) {
                editor.setPixel(coord, pixel);
            }
            editor.endChange(mode);
        }
    }
    doUndo(editor) {
        const buffer = this.undoBuffer.pop();
        if (buffer != null) {
            this.processChangeBuffer(editor, buffer, ChangeMode.Undo);
            this.undoButton.flash();
        }
    }
    doRedo(editor) {
        const buffer = this.redoBuffer.pop();
        if (buffer != null) {
            this.processChangeBuffer(editor, buffer, ChangeMode.Redo);
            this.redoButton.flash();
        }
    }
    keyDown(key, editor) {
        if (isMac) {
            if (key.shift) {
                this.doRedo(editor);
            }
            else {
                this.doUndo(editor);
            }
        }
        else {
            if (key.code == 'KeyY') {
                this.doRedo(editor);
            }
            else {
                this.doUndo(editor);
            }
        }
        return false;
    }
    change(coord, from, editor) {
        if (!this.changeBuffer.has(coord.toIndex(editor.width))) {
            this.changeBuffer.set(coord.toIndex(editor.width), [coord, from]);
        }
    }
    clearRedoBuffer() {
        if (this.redoBuffer.length > 0) {
            this.redoBuffer = new Array();
        }
    }
    allChange(from, mode, _editor) {
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
    endChange(_editor, mode) {
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
//# sourceMappingURL=undo_tool.js.map
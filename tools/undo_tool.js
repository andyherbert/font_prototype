import { Button } from '../editor/button.js';
import { ChangeMode, isMac } from '../editor/tools.js';
class Buffers {
    undo = new Array();
    redo = new Array();
    change = new Map();
    clear() {
        this.undo = new Array();
        this.redo = new Array();
        this.change = new Map();
    }
}
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
    buffers;
    currentCode = 0;
    undoButton = new Button('Undo');
    redoButton = new Button('Redo');
    constructor() {
        this.buffers = new Array();
        for (let i = 0; i < 256; i++) {
            this.buffers.push(new Buffers());
        }
    }
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
        const buffer = this.buffers[this.currentCode].undo.pop();
        if (buffer != null) {
            this.processChangeBuffer(editor, buffer, ChangeMode.Undo);
            this.undoButton.flash();
        }
    }
    doRedo(editor) {
        const buffer = this.buffers[this.currentCode].redo.pop();
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
        const buffer = this.buffers[this.currentCode];
        if (!buffer.change.has(coord.toIndex(editor.width))) {
            buffer.change.set(coord.toIndex(editor.width), [coord, from]);
        }
    }
    clearRedoBuffer() {
        const buffer = this.buffers[this.currentCode];
        if (buffer.redo.length > 0) {
            buffer.redo = new Array();
        }
    }
    allChange(from, mode, _editor) {
        const buffer = this.buffers[this.currentCode];
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
    endChange(mode, _editor) {
        const buffer = this.buffers[this.currentCode];
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
            buffer.change = new Map();
        }
    }
    setCode(code, _editor) {
        this.currentCode = code;
    }
    changeFont(_width, _height, _editor) {
        for (const buffer of this.buffers) {
            buffer.clear();
        }
    }
}
//# sourceMappingURL=undo_tool.js.map
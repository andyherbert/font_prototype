import { Button } from '../editor/button.js';
export default class PasteBoardTool {
    name = 'PasteBoard';
    shortcuts = [
        { code: 'KeyX', cmd: true, shift: false, repeat: false },
        { code: 'KeyC', cmd: true, shift: false, repeat: false },
        { code: 'KeyV', cmd: true, shift: false, repeat: false },
    ];
    copyButton = new Button('Copy');
    cutButton = new Button('Cut');
    pasteButton = new Button('Paste');
    pasteboard = null;
    init(editor) {
        editor.addElementToDock(this.cutButton.getDiv());
        editor.addElementToDock(this.copyButton.getDiv());
        editor.addElementToDock(this.pasteButton.getDiv());
        this.cutButton.addEventListener('pointerdown', () => {
            this.cutButtonClick(editor);
        });
        this.copyButton.addEventListener('pointerdown', () => {
            this.copyButtonClick(editor);
        });
        this.pasteButton.addEventListener('pointerdown', () => {
            this.pasteButtonClick(editor);
        });
    }
    keyDown(key, editor) {
        switch (key.code) {
            case 'KeyC': {
                this.copyButtonClick(editor);
                break;
            }
            case 'KeyX': {
                this.cutButtonClick(editor);
                break;
            }
            case 'KeyV': {
                this.pasteButtonClick(editor);
                break;
            }
        }
        return false;
    }
    copyButtonClick(editor) {
        this.copyButton.flash();
        this.pasteboard = editor.getData();
    }
    cutButtonClick(editor) {
        this.cutButton.flash();
        this.pasteboard = editor.getData();
        const newData = new Array(editor.getData().length);
        newData.fill(false);
        editor.setData(newData);
    }
    pasteButtonClick(editor) {
        if (this.pasteboard != null) {
            this.pasteButton.flash();
            editor.setData(this.pasteboard);
        }
    }
}
//# sourceMappingURL=pasteboard_tool.js.map
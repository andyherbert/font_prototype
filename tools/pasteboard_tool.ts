import { Key, ToolInterface } from '../editor/tools.js';
import { Button } from '../editor/button.js';
import Editor from '../editor/editor.js';

export default class PasteBoardTool implements ToolInterface {
    name = 'PasteBoard';
    shortcuts = [
        { code: 'KeyC', cmd: true, shift: false, repeat: false },
        { code: 'KeyX', cmd: true, shift: false, repeat: false },
        { code: 'KeyV', cmd: true, shift: false, repeat: false },
    ];
    private readonly copyButton = new Button('Copy');
    private readonly cutButton = new Button('Cut');
    private readonly pasteButton = new Button('Paste');
    private pasteboard: Array<boolean> | null = null;

    init(editor: Editor): void {
        editor.addElementToDock(this.copyButton.getDiv());
        editor.addElementToDock(this.cutButton.getDiv());
        editor.addElementToDock(this.pasteButton.getDiv());
        this.cutButton.addEventListener('pointerdown', () => {
            this.cutButtonClick(editor);
        });
        this.cutButton.addEventListener('pointerdown', () => {
            this.copyButtonClick(editor);
        });
        this.cutButton.addEventListener('pointerdown', () => {
            this.pasteButtonClick(editor);
        });
    }

    keyDown(key: Key, editor: Editor): boolean {
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

    copyButtonClick(editor: Editor): void {
        this.copyButton.flash();
        this.pasteboard = editor.getData();
    }

    cutButtonClick(editor: Editor): void {
        this.cutButton.flash();
        this.pasteboard = editor.getData();
        const newData = new Array(editor.getData().length);
        newData.fill(false);
        editor.setData(newData);
    }

    pasteButtonClick(editor: Editor): void {
        if (this.pasteboard != null) {
            this.pasteButton.flash();
            editor.setData(this.pasteboard);
        }
    }
}

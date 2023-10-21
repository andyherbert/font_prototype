import Editor from '../editor/editor.js';
import { ToolInterface } from '../editor/tools';
import { Button } from '../editor/button.js';

export default class NewTool implements ToolInterface {
    name = 'New';
    private readonly button = new Button('New');

    init(editor: Editor): void {
        editor.addElementToDock(this.button.getDiv());
        this.button.addEventListener('pointerdown', () => {
            this.button.flash();
            this.newFont(editor.width, editor.height, editor);
        });
    }

    private newFont(width: number, height: number, editor: Editor) {
        const data = new Array(256);
        for (let i = 0; i < 256; i++) {
            data[i] = new Array(width * height).fill(false);
        }
        editor.changeFont(width, height, data);
    }
}

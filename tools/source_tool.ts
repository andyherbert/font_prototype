import { Button } from '../editor/button.js';
import Editor from '../editor/editor.js';
import { ToolInterface } from '../editor/tools.js';

export default class SourceTool implements ToolInterface {
    name = 'Source';
    private readonly button = new Button('Source');

    init(editor: Editor): void {
        editor.addElementToDock(this.button.getDiv());
        this.button.addEventListener('pointerdown', () => {
            this.button.flash();
            const a = document.createElement('a');
            a.href = 'https://github.com/andyherbert/font_prototype';
            a.click();
        });
    }
}

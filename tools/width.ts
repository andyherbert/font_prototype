import { NumberButton } from '../editor/button.js';
import Editor from '../editor/editor.js';

export default class WidthTool {
    readonly name = 'Width';
    private readonly widthButton = new NumberButton('Width');

    init(editor: Editor): void {
        editor.addElementToDock(this.widthButton.getDiv());
        this.widthButton.addEventListenerDecrease('pointerdown', () => {
            const width = editor.getWidth();
            if (width > 1 && width < 32) {
                this.widthButton.flashDecrease();
                editor.setWidth(width - 1);
            }
        });
        this.widthButton.addEventListenerIncrease('pointerdown', () => {
            const width = editor.getWidth();
            if (width < 32) {
                this.widthButton.flashIncrease();
                editor.setWidth(width + 1);
            }
        });
    }
}

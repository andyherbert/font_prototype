import { NumberButton } from '../editor/button.js';
export default class WidthTool {
    name = 'Width';
    widthButton = new NumberButton('Width');
    init(editor) {
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
//# sourceMappingURL=width_tool.js.map
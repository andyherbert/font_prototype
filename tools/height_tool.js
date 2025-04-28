import { NumberButton } from '../editor/button.js';
export default class HeightTool {
    name = 'Height';
    heightButton = new NumberButton('Height');
    init(editor) {
        editor.addElementToDock(this.heightButton.getDiv());
        this.heightButton.addEventListenerDecrease('pointerdown', () => {
            const height = editor.getHeight();
            if (height > 1 && height < 32) {
                this.heightButton.flashDecrease();
                editor.setHeight(height - 1);
            }
        });
        this.heightButton.addEventListenerIncrease('pointerdown', () => {
            const height = editor.getHeight();
            if (height < 32) {
                this.heightButton.flashIncrease();
                editor.setHeight(height + 1);
            }
        });
    }
}
//# sourceMappingURL=height_tool.js.map
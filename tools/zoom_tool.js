import { NumberButton } from '../editor/button.js';
export default class ZoomTool {
    name = 'Zoom';
    shortcuts = [
        { code: 'Minus', cmd: true, shift: false, repeat: true },
        { code: 'Equal', cmd: true, shift: false, repeat: true },
        { code: 'Digit0', cmd: true, shift: false, repeat: false },
    ];
    zoomButton = new NumberButton('Zoom');
    zoomIn(editor) {
        this.zoomButton.flashIncrease();
        editor.zoomIn();
    }
    zoomOut(editor) {
        this.zoomButton.flashDecrease();
        editor.zoomOut();
    }
    zoomToFit(editor) {
        this.zoomButton.flash();
        editor.zoomToFit();
    }
    init(editor) {
        editor.addElementToDock(this.zoomButton.getDiv());
        this.zoomButton.addEventListenerDecrease('pointerdown', () => {
            this.zoomOut(editor);
        });
        this.zoomButton.addEventListenerIncrease('pointerdown', () => {
            this.zoomIn(editor);
        });
        this.zoomButton.addEventListener('pointerdown', () => {
            this.zoomToFit(editor);
        });
    }
    keyDown(key, editor) {
        switch (key.code) {
            case 'Digit0': {
                this.zoomToFit(editor);
                break;
            }
            case 'Minus': {
                this.zoomOut(editor);
                break;
            }
            case 'Equal': {
                this.zoomIn(editor);
                break;
            }
        }
        return false;
    }
}
//# sourceMappingURL=zoom_tool.js.map
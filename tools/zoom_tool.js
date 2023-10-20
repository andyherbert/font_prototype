import { Button } from '../editor/button.js';
export default class ZoomTool {
    name = 'Pixel';
    shortcuts = [
        { code: 'Minus', cmd: true, shift: false, repeat: true },
        { code: 'Equal', cmd: true, shift: false, repeat: true },
        { code: 'Digit0', cmd: true, shift: false, repeat: false },
    ];
    zoomInButton = new Button('Zoom In');
    zoomOutButton = new Button('Zoom Out');
    zoomToFitButton = new Button('Fit to Screen');
    zoomIn(editor) {
        this.zoomInButton.flash();
        editor.zoomIn();
    }
    zoomOut(editor) {
        this.zoomOutButton.flash();
        editor.zoomOut();
    }
    zoomToFit(editor) {
        this.zoomToFitButton.flash();
        editor.zoomToFit();
    }
    init(editor) {
        editor.addElementToDock(this.zoomInButton.getDiv());
        editor.addElementToDock(this.zoomOutButton.getDiv());
        editor.addElementToDock(this.zoomToFitButton.getDiv());
        this.zoomInButton.addEventListener('pointerdown', () => {
            this.zoomIn(editor);
        });
        this.zoomOutButton.addEventListener('pointerdown', () => {
            this.zoomOut(editor);
        });
        this.zoomToFitButton.addEventListener('pointerdown', () => {
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
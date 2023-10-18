import { Button } from '../editor/button.js';
export default class ZoomTool {
    name = 'Pixel';
    shortcuts = [
        { code: 'Minus', cmd: false, shift: false, repeat: true },
        { code: 'Equal', cmd: false, shift: false, repeat: true },
        { code: 'Digit0', cmd: false, shift: false, repeat: false },
        { code: 'Digit1', cmd: false, shift: false, repeat: false },
        { code: 'Digit2', cmd: false, shift: false, repeat: false },
    ];
    zoom = null;
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
            case 'Digit1': {
                this.zoom = editor.getScale();
                editor.setScale(0);
                break;
            }
            case 'Digit2': {
                this.zoom = editor.getScale();
                editor.setScale(1);
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
    keyUp(_key, editor) {
        if (this.zoom != null) {
            editor.setScale(this.zoom);
            this.zoom = null;
        }
    }
}
//# sourceMappingURL=zoom_tool.js.map
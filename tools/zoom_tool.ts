import { NumberButton } from '../editor/button.js';
import Editor from '../editor/editor.js';
import { Key, ToolInterface } from '../editor/tools.js';

export default class ZoomTool implements ToolInterface {
    readonly name = 'Zoom';
    readonly shortcuts = [
        { code: 'Minus', cmd: true, shift: false, repeat: true },
        { code: 'Equal', cmd: true, shift: false, repeat: true },
        { code: 'Digit0', cmd: true, shift: false, repeat: false },
    ];
    private readonly zoomButton = new NumberButton('Zoom');

    private zoomIn(editor: Editor): void {
        this.zoomButton.flashIncrease();
        editor.zoomIn();
    }

    private zoomOut(editor: Editor): void {
        this.zoomButton.flashDecrease();
        editor.zoomOut();
    }

    private zoomToFit(editor: Editor): void {
        this.zoomButton.flash();
        editor.zoomToFit();
    }

    init(editor: Editor): void {
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

    keyDown(key: Key, editor: Editor): boolean {
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

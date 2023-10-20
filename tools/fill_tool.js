import { Button } from '../editor/button.js';
export default class FillTool {
    name = 'Fill';
    cursor = 'crosshair';
    shortcuts = [
        { code: 'KeyP', cmd: true, shift: true, repeat: false },
    ];
    button = new Button('Fill');
    init(editor) {
        editor.addElementToDock(this.button.getDiv());
        this.button.addEventListener('pointerdown', () => {
            editor.setTool(this);
        });
    }
    focus(_editor) {
        this.button.focus();
    }
    blur(_editor) {
        this.button.blur();
    }
    pointerDown(coord, editor) {
        const pointMode = !editor.getPixel(coord);
        const queue = [coord];
        while (true) {
            const coord = queue.pop();
            if (coord == null) {
                break;
            }
            if (coord.withinBounds(editor.width, editor.height)) {
                const pixel = editor.getPixel(coord);
                if (pixel != pointMode) {
                    if (pixel) {
                        editor.setPixel(coord, false);
                    }
                    else {
                        editor.setPixel(coord, true);
                    }
                    queue.push(coord.add(0, -1), coord.add(0, 1), coord.add(-1, 0), coord.add(1, 0));
                }
            }
        }
        editor.endChange();
    }
}
//# sourceMappingURL=fill_tool.js.map
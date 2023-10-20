import { Button } from '../editor/button.js';
import Editor from '../editor/editor.js';
import { ToolInterface } from '../editor/tools.js';

import Coord from '../editor/coord.js';

export default class FillTool implements ToolInterface {
    readonly name = 'Fill';
    readonly cursor = 'crosshair';
    readonly shortcuts = [
        { code: 'KeyP', cmd: true, shift: true, repeat: false },
    ];
    private readonly button = new Button('Fill');

    init(editor: Editor): void {
        editor.addElementToDock(this.button.getDiv());
        this.button.addEventListener('pointerdown', () => {
            editor.setTool(this);
        });
    }

    focus(_editor: Editor): void {
        this.button.focus();
    }

    blur(_editor: Editor): void {
        this.button.blur();
    }

    pointerDown(coord: Coord, editor: Editor): void {
        const pointMode = !editor.getPixel(coord);
        const queue: Coord[] = [coord];
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
                    } else {
                        editor.setPixel(coord, true);
                    }
                    queue.push(
                        coord.add(0, -1),
                        coord.add(0, 1),
                        coord.add(-1, 0),
                        coord.add(1, 0)
                    );
                }
            }
        }
        editor.endChange();
    }
}

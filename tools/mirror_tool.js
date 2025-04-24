import { Button } from '../editor/button.js';
import Coord from '../editor/coord.js';
export default class MirrorTool {
    name = 'Mirror';
    buttonHorizontally = new Button('Mirror Horizontally');
    buttonVertically = new Button('Mirror Vertically');
    init(editor) {
        editor.addElementToDock(this.buttonHorizontally.getDiv());
        this.buttonHorizontally.addEventListener('pointerdown', () => {
            this.mirrorHorizontally(editor);
            this.buttonHorizontally.flash();
        });
        editor.addElementToDock(this.buttonVertically.getDiv());
        this.buttonVertically.addEventListener('pointerdown', () => {
            this.mirrorVertically(editor);
            this.buttonVertically.flash();
        });
    }
    mirrorHorizontally(editor) {
        const width = editor.width;
        const pixels = editor.getData();
        for (const [from, pixel] of editor.enumeratePixels()) {
            const to = new Coord(width - from.x - 1, from.y);
            pixels[to.toIndex(width)] = pixel;
        }
        editor.setData(pixels);
    }
    mirrorVertically(editor) {
        const width = editor.width;
        const height = editor.height;
        const pixels = editor.getData();
        for (const [from, pixel] of editor.enumeratePixels()) {
            const to = new Coord(from.x, height - from.y - 1);
            pixels[to.toIndex(width)] = pixel;
        }
        editor.setData(pixels);
    }
}
//# sourceMappingURL=mirror_tool.js.map
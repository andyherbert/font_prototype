import { Button } from '../editor/button.js';
export default class SaveBitmaskTool {
    name = 'Save Bitmask';
    button = new Button('Save Bitmask');
    init(editor) {
        editor.addElementToDock(this.button.getDiv());
        this.button.addEventListener('pointerdown', () => {
            this.saveBitmask(editor);
            this.button.flash();
        });
    }
    saveBitmask(editor) {
        const width = editor.getWidth();
        if (width != 8) {
            alert('Bitmask width must be 8');
            return;
        }
        const height = editor.getHeight();
        const bytes = new Uint8Array(height * 256);
        for (let i = 0; i < 256; i++) {
            for (const [coord, pixel] of editor.enumeratePixelsFor(i)) {
                const byteIndex = i * height + coord.y;
                if (pixel) {
                    bytes[byteIndex] += 1 << (7 - coord.x);
                }
            }
        }
        const blob = new Blob([bytes], {
            type: 'application/octet-stream',
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const extension = `F${height.toString(10).padStart(2, '0')}`;
        a.download = `charmap.${extension}`;
        a.click();
        URL.revokeObjectURL(url);
    }
}
//# sourceMappingURL=save_bitmask.js.map
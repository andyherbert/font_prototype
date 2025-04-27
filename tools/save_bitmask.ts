import { Button } from '../editor/button.js';
import Editor from '../editor/editor.js';
import { ToolInterface } from '../editor/tools';

export default class SaveBitmaskTool implements ToolInterface {
    name = 'Save Bitmask';
    private readonly button = new Button('Save Bitmask');

    init(editor: Editor): void {
        editor.addElementToDock(this.button.getDiv());
        this.button.addEventListener('pointerdown', () => {
            this.saveBitmask(editor);
            this.button.flash();
        });
    }

    private saveBitmask(editor: Editor): void {
        const width = editor.getWidth();
        if (width != 8) {
            alert('Bitmask width must be 8');
            return;
        }
        const height = editor.getHeight();
        const bytes = new Uint8Array(height * 256);
        for (let i = 0; i < 256; i++) {
            for (const [coord, pixel] of editor.enumeratePixelsFor(i)!) {
                const byteIndex = i * height + coord.y;
                if (pixel) {
                    bytes[byteIndex]! += 1 << (7 - coord.x);
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

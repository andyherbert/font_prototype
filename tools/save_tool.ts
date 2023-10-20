import { Button } from '../editor/button.js';
import Editor from '../editor/editor.js';
import { ToolInterface } from '../editor/tools';

export default class SaveTool implements ToolInterface {
    name = 'Save';
    private readonly button = new Button('Save');

    init(editor: Editor): void {
        editor.addElementToDock(this.button.getDiv());
        this.button.addEventListener('pointerdown', () => {
            this.save(editor);
            this.button.flash();
        });
    }

    private save(editor: Editor): void {
        const canvas = document.createElement('canvas');
        canvas.width = editor.width * 16;
        canvas.height = editor.height * 16;
        const ctx = canvas.getContext('2d')!;
        for (let i = 0; i < 256; i += 1) {
            const imageData = ctx.createImageData(editor.width, editor.height);
            for (const [coord, pixel] of editor.enumeratePixelsFor(i)!) {
                const value = pixel ? 255 : 0;
                const j = coord.toIndex(editor.width);
                imageData.data[j * 4 + 0] = value;
                imageData.data[j * 4 + 1] = value;
                imageData.data[j * 4 + 2] = value;
                imageData.data[j * 4 + 3] = 255;
            }
            const x = i % 16;
            const y = Math.floor(i / 16);
            ctx.putImageData(imageData, x * editor.width, y * editor.height);
        }
        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob!);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'charmap.png';
            a.click();
            URL.revokeObjectURL(url);
        }, 'image/png');
    }
}

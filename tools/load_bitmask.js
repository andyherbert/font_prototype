import { LoadButton } from '../editor/button.js';
export default class LoadBitmaskTool {
    name = 'Load Bitmask';
    button = new LoadButton('Load Bitmask', '*');
    init(editor) {
        editor.addElementToDock(this.button.getDiv());
        this.button.addEventListener('pointerdown', () => {
            this.button.flash();
        });
        this.button.addFileListener((_event) => {
            const file = this.button.getFile();
            if (file != null) {
                this.loadFont(file, editor);
            }
        });
    }
    loadFont(file, editor) {
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = () => {
            const buffer = reader.result;
            const bytes = new Uint8Array(buffer);
            const length = bytes.length;
            if (length % 256 != 0 || (length / 256) % 8 != 0) {
                alert('Invalid bitmask file');
                return;
            }
            const width = 8;
            const height = bytes.length / 256;
            const data = new Array(256);
            for (let i = 0; i < 256; i++) {
                data[i] = new Array(width * height).fill(false);
                for (let y = 0; y < height; y++) {
                    for (let x = 0; x < width; x++) {
                        const index = y * width + x;
                        const byteIndex = i * height + y;
                        data[i][index] =
                            (bytes[byteIndex] & (1 << (7 - x))) != 0;
                    }
                }
            }
            editor.changeFont(width, height, data);
        };
    }
}
//# sourceMappingURL=load_bitmask.js.map
import { LoadButton } from '../editor/button.js';
import Editor from '../editor/editor.js';
import { ToolInterface } from '../editor/tools.js';

function fileToCanvas(file: File): Promise<HTMLCanvasElement> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const img = new Image();
            img.src = reader.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d')!;
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                resolve(canvas);
            };
        };
        reader.onerror = reject;
    });
}

export default class LoadTool implements ToolInterface {
    name = 'Load';
    private readonly button = new LoadButton('Load');

    init(editor: Editor): void {
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

    private loadFont(file: File, editor: Editor): void {
        fileToCanvas(file).then((canvas) => {
            let fontWidth = canvas.width / 16;
            let fontHeight = canvas.height / 16;
            const data = new Array(256);
            for (let i = 0; i < 256; i++) {
                data[i] = new Array(fontWidth * fontHeight).fill(false);
            }
            const imageData = canvas
                .getContext('2d')!
                .getImageData(0, 0, canvas.width, canvas.height);
            for (let code = 0; code < 256; code++) {
                let cx = code % 16;
                let cy = Math.floor(code / 16);
                for (let x = 0; x < fontWidth; x++) {
                    for (let y = 0; y < fontHeight; y++) {
                        const index =
                            (cy * fontHeight + y) * canvas.width * 4 +
                            (cx * fontWidth + x) * 4;
                        const r = imageData.data[index]!;
                        const g = imageData.data[index + 1]!;
                        const b = imageData.data[index + 2]!;
                        if (r > 127 && g > 128 && b > 127) {
                            data[code][y * fontWidth + x] = true;
                        }
                    }
                }
            }
            editor.changeFont(fontWidth, fontHeight, data);
        });
    }
}

import Button from './button.js';
import Editor from '../editor/editor.js';
import {
    ChangeMode,
    Key,
    ToolInterface,
    black,
    red,
    white,
} from '../editor/tools.js';
import Coord from '../editor/coord.js';

class NumberButton extends Button {
    private readonly decreaseButton = new Button('-');
    private readonly increaseButton = new Button('+');
    private readonly container = document.createElement('div');

    constructor(text: string) {
        super(text);
        this.container.style.display = 'flex';
        this.container.style.flexDirection = 'row';
        this.decreaseButton.getDiv().style.width = '24px';
        super.getDiv().style.width = '130px';
        this.increaseButton.getDiv().style.width = '24px';
        this.container.appendChild(this.decreaseButton.getDiv());
        this.container.appendChild(super.getDiv());
        this.container.appendChild(this.increaseButton.getDiv());
    }

    addEventListenerIncrease(type: string, listener: EventListener): void {
        this.increaseButton.addEventListener(type, listener);
    }

    addEventListenerDecrease(type: string, listener: EventListener): void {
        this.decreaseButton.addEventListener(type, listener);
    }

    flashIncrease(): void {
        this.increaseButton.flash();
    }

    flashDecrease(): void {
        this.decreaseButton.flash();
    }

    override getDiv(): HTMLDivElement {
        return this.container;
    }
}

export default class GridTool implements ToolInterface {
    readonly name = 'Grid';
    readonly shortcuts = [
        { code: 'KeyG', cmd: false, shift: false, repeat: false },
    ];
    private canvas = document.createElement('canvas');
    private ctx: CanvasRenderingContext2D | null = null;
    private baseLine: number = 0;
    private meanLine: number = 0;
    private gapLine: number = 0;
    private baseLineVisible = true;
    private meanLineVisible = true;
    private gapLineVisible = true;
    private gridVisible = true;
    private solidHorizontalLineWhite: ImageData | null = null;
    private solidVerticalLineWhite: ImageData | null = null;
    private dottedHorizontalLineWhite: ImageData | null = null;
    private dottedHorizontalLineBlack: ImageData | null = null;
    private dottedHorizontalLineRed: ImageData | null = null;
    private dottedVerticalLineWhite: ImageData | null = null;
    private dottedVerticalLineBlack: ImageData | null = null;
    private dottedVerticalLineRed: ImageData | null = null;
    private readonly gridButton = new Button('Grid');
    private readonly baseLineButton = new NumberButton('Baseline');
    private readonly meanLineButton = new NumberButton('Meanline');
    private readonly gapLineButton = new NumberButton('Gapline');

    private updateGridButton(): void {
        if (this.gridVisible) {
            this.gridButton.setText('Grid: On');
        } else {
            this.gridButton.setText('Grid: Off');
        }
    }

    private updateBaseLineButton(): void {
        if (this.baseLineVisible) {
            this.baseLineButton.setText(`Baseline: ${this.baseLine}`);
        } else {
            this.baseLineButton.setText('Baseline: Off');
        }
    }

    private updateMeanLineButton(): void {
        if (this.meanLineVisible) {
            this.meanLineButton.setText(`Meanline: ${this.meanLine}`);
        } else {
            this.meanLineButton.setText('Meanline: Off');
        }
    }

    private updateGapLineButton(): void {
        if (this.gapLineVisible) {
            this.gapLineButton.setText(`Gapline: ${this.gapLine}`);
        } else {
            this.gapLineButton.setText('Gapline: Off');
        }
    }

    private toggleGrid(editor: Editor): void {
        this.gridVisible = !this.gridVisible;
        this.updateGridButton();
        this.redraw(editor);
    }

    private toggleBaseline(editor: Editor): void {
        this.baseLineVisible = !this.baseLineVisible;
        this.updateBaseLineButton();
        this.redraw(editor);
    }

    private toggleMeanline(editor: Editor): void {
        this.meanLineVisible = !this.meanLineVisible;
        this.updateMeanLineButton();
        this.redraw(editor);
    }

    private toggleGapLine(editor: Editor): void {
        this.gapLineVisible = !this.gapLineVisible;
        this.updateGapLineButton();
        this.redraw(editor);
    }

    init(editor: Editor): void {
        this.baseLine = Math.floor(editor.height * 0.8);
        this.meanLine = Math.floor(editor.height * 0.3);
        this.gapLine = Math.floor(editor.width * 0.9);
        this.ctx = this.canvas.getContext('2d', {
            willReadFrequently: true,
        });
        editor.addOverlay(this.canvas);
        editor.addElementToDock(this.gridButton.getDiv());
        editor.addElementToDock(this.baseLineButton.getDiv());
        editor.addElementToDock(this.meanLineButton.getDiv());
        editor.addElementToDock(this.gapLineButton.getDiv());
        this.gridButton.addEventListener('pointerdown', () => {
            this.toggleGrid(editor);
        });
        this.baseLineButton.addEventListener('pointerdown', () => {
            this.toggleBaseline(editor);
            this.baseLineButton.flash();
        });
        this.baseLineButton.addEventListenerIncrease('pointerdown', () => {
            if (this.baseLineVisible && this.baseLine < editor.height - 1) {
                this.baseLine += 1;
                this.updateBaseLineButton();
                this.redraw(editor);
                this.baseLineButton.flashIncrease();
            }
        });
        this.baseLineButton.addEventListenerDecrease('pointerdown', () => {
            if (this.baseLineVisible && this.baseLine > 1) {
                this.baseLine -= 1;
                this.updateBaseLineButton();
                this.redraw(editor);
                this.baseLineButton.flashDecrease();
            }
        });
        this.meanLineButton.addEventListener('pointerdown', () => {
            this.toggleMeanline(editor);
            this.meanLineButton.flash();
        });
        this.meanLineButton.addEventListenerIncrease('pointerdown', () => {
            if (this.meanLineVisible && this.meanLine < editor.height - 1) {
                this.meanLine += 1;
                this.updateMeanLineButton();
                this.redraw(editor);
                this.meanLineButton.flashIncrease();
            }
        });
        this.meanLineButton.addEventListenerDecrease('pointerdown', () => {
            if (this.meanLineVisible && this.meanLine > 1) {
                this.meanLine -= 1;
                this.updateMeanLineButton();
                this.redraw(editor);
                this.meanLineButton.flashDecrease();
            }
        });
        this.gapLineButton.addEventListener('pointerdown', () => {
            this.toggleGapLine(editor);
            this.gapLineButton.flash();
        });
        this.gapLineButton.addEventListenerIncrease('pointerdown', () => {
            if (this.gapLineVisible && this.gapLine < editor.width - 1) {
                this.gapLine += 1;
                this.updateGapLineButton();
                this.redraw(editor);
                this.gapLineButton.flashIncrease();
            }
        });
        this.gapLineButton.addEventListenerDecrease('pointerdown', () => {
            if (this.gapLineVisible && this.gapLine > 1) {
                this.gapLine -= 1;
                this.updateGapLineButton();
                this.redraw(editor);
                this.gapLineButton.flashDecrease();
            }
        });
        this.updateGridButton();
        this.updateBaseLineButton();
        this.updateMeanLineButton();
        this.updateGapLineButton();
        this.scaled(editor);
    }

    keyDown(_key: Key, editor: Editor): boolean {
        this.toggleGrid(editor);
        this.redraw(editor);
        return false;
    }

    private drawHorizontalGrid(
        coord: Coord,
        imageData: ImageData | null
    ): void {
        if (this.ctx != null && imageData != null) {
            this.ctx.putImageData(
                imageData,
                coord.x * imageData.width,
                coord.y * imageData.width
            );
        }
    }

    private drawVerticalGrid(coord: Coord, imageData: ImageData | null): void {
        if (this.ctx != null && imageData != null) {
            this.ctx.putImageData(
                imageData,
                coord.x * imageData.height,
                coord.y * imageData.height
            );
        }
    }

    private drawTopBorder(coord: Coord, imageData: ImageData | null): void {
        if (this.ctx != null && imageData != null) {
            this.ctx.putImageData(imageData, coord.x * imageData.width, 0);
        }
    }

    private drawBottomBorder(coord: Coord, imageData: ImageData | null): void {
        if (this.ctx != null && imageData != null) {
            this.ctx.putImageData(
                imageData,
                coord.x * imageData.width,
                (coord.y + 1) * imageData.width - 1
            );
        }
    }

    private drawLeftBorder(coord: Coord, imageData: ImageData | null): void {
        if (this.ctx != null && imageData != null) {
            this.ctx.putImageData(imageData, 0, coord.y * imageData.height);
        }
    }

    private drawRightBorder(coord: Coord, imageData: ImageData | null): void {
        if (this.ctx != null && imageData != null) {
            this.ctx.putImageData(
                imageData,
                (coord.x + 1) * imageData.height - 1,
                coord.y * imageData.height
            );
        }
    }

    private draw(coord: Coord, pixel: boolean, editor: Editor): void {
        const scale = editor.getScale();
        if (this.gridVisible) {
            if (scale >= 4) {
                if (coord.y > 0) {
                    if (pixel) {
                        this.drawHorizontalGrid(
                            coord,
                            this.dottedHorizontalLineBlack
                        );
                    } else {
                        this.drawHorizontalGrid(
                            coord,
                            this.dottedHorizontalLineWhite
                        );
                    }
                }
                if (coord.x > 0) {
                    if (pixel) {
                        this.drawVerticalGrid(
                            coord,
                            this.dottedVerticalLineBlack
                        );
                    } else {
                        this.drawVerticalGrid(
                            coord,
                            this.dottedVerticalLineWhite
                        );
                    }
                }
            }
        }
        if (scale >= 3) {
            if (this.baseLineVisible) {
                if (coord.y == this.baseLine) {
                    this.drawHorizontalGrid(
                        coord,
                        this.dottedHorizontalLineRed
                    );
                }
            }
            if (this.meanLineVisible) {
                if (coord.y == this.meanLine) {
                    this.drawHorizontalGrid(
                        coord,
                        this.dottedHorizontalLineRed
                    );
                }
            }
            if (this.gapLineVisible) {
                if (coord.x == this.gapLine) {
                    this.drawVerticalGrid(coord, this.dottedVerticalLineRed);
                }
            }
        }
        if (scale >= 5) {
            if (coord.y == 0) {
                this.drawTopBorder(coord, this.solidHorizontalLineWhite);
            }
            if (coord.y == editor.height - 1) {
                this.drawBottomBorder(coord, this.solidHorizontalLineWhite);
            }
            if (coord.x == 0) {
                this.drawLeftBorder(coord, this.solidVerticalLineWhite);
            }
            if (coord.x == editor.width - 1) {
                this.drawRightBorder(coord, this.solidVerticalLineWhite);
            }
        } else if (scale >= 2) {
            if (coord.y == 0) {
                this.drawTopBorder(coord, this.dottedHorizontalLineWhite);
            }
            if (coord.y == editor.height - 1) {
                this.drawBottomBorder(coord, this.dottedHorizontalLineWhite);
            }
            if (coord.x == 0) {
                this.drawLeftBorder(coord, this.dottedVerticalLineWhite);
            }
            if (coord.x == editor.width - 1) {
                this.drawRightBorder(coord, this.dottedVerticalLineWhite);
            }
        }
    }

    private redraw(editor: Editor): void {
        if (this.ctx != null) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
        for (const [coord, pixel] of editor.enumeratePixels()) {
            this.draw(coord, pixel, editor);
        }
    }

    scaled(editor: Editor): void {
        if (this.ctx != null) {
            const scale = Math.floor(editor.scaledWidth() / editor.width);
            this.solidHorizontalLineWhite = this.ctx.createImageData(scale, 1);
            this.solidVerticalLineWhite = this.ctx.createImageData(1, scale);
            this.dottedHorizontalLineWhite = this.ctx.createImageData(scale, 1);
            this.dottedHorizontalLineBlack = this.ctx.createImageData(scale, 1);
            this.dottedHorizontalLineRed = this.ctx.createImageData(scale, 1);
            this.dottedVerticalLineWhite = this.ctx.createImageData(1, scale);
            this.dottedVerticalLineBlack = this.ctx.createImageData(1, scale);
            this.dottedVerticalLineRed = this.ctx.createImageData(1, scale);
            const dottedWhite = new Uint8ClampedArray(scale * 4);
            const dottedBlack = new Uint8ClampedArray(scale * 4);
            const dottedRed = new Uint8ClampedArray(scale * 4);
            const solidWhite = new Uint8ClampedArray(scale * 4);
            for (let i = 0; i < scale * 4; i += 4) {
                if (i % 8 == 0) {
                    dottedWhite.set(white.rgbaData, i);
                    dottedBlack.set(black.rgbaData, i);
                    dottedRed.set(red.rgbaData, i);
                }
                solidWhite.set(white.rgbaData, i);
            }
            this.solidHorizontalLineWhite.data.set(solidWhite);
            this.solidVerticalLineWhite.data.set(solidWhite);
            this.dottedHorizontalLineWhite.data.set(dottedWhite);
            this.dottedHorizontalLineBlack.data.set(dottedBlack);
            this.dottedHorizontalLineRed.data.set(dottedRed);
            this.dottedVerticalLineWhite.data.set(dottedWhite);
            this.dottedVerticalLineBlack.data.set(dottedBlack);
            this.dottedVerticalLineRed.data.set(dottedRed);
            this.canvas.width = editor.scaledWidth();
            this.canvas.height = editor.scaledHeight();
            this.redraw(editor);
        }
    }

    change(coord: Coord, from: boolean, editor: Editor): void {
        this.draw(coord, !from, editor);
    }

    allChange(_from: boolean[], _mode: ChangeMode, editor: Editor): void {
        this.redraw(editor);
    }
}

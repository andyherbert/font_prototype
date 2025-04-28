import Coord from './coord.js';
import {
    ChangeMode,
    Encoding,
    eventToKey,
    findCodeInDefinitions,
    ToolInterface,
    black,
    white,
} from './tools.js';
import InfoBar from './info_bar.js';
import { Window, WindowInterface } from './window.js';

import UndoTool from '../tools/undo_tool.js';
import CanvasTool from '../tools/canvas_tool.js';
import GridTool from '../tools/grid_tool.js';
import PixelTool from '../tools/pixel_tool.js';
import FillTool from '../tools/fill_tool.js';
import MoveTool from '../tools/move_tool.js';
import MirrorTool from '../tools/mirror_tool.js';
import ZoomTool from '../tools/zoom_tool.js';
import FontTool from '../tools/font_tool.js';
import SaveTool from '../tools/save_tool.js';
import LoadTool from '../tools/load_tool.js';
import LoadBitmaskTool from '../tools/load_bitmask.js';
import SaveBitmaskTool from '../tools/save_bitmask.js';
import WidthTool from '../tools/width_tool.js';
import HeightTool from '../tools/height_tool.js';
import NewTool from '../tools/new_tool.js';
import PreviewTool from '../tools/preview_tool.js';
import PasteBoardTool from '../tools/pasteboard_tool.js';
import SourceTool from '../tools/source_tool.js';

class Dock implements WindowInterface {
    private readonly window = new Window(this);

    constructor() {}

    addTo(div: HTMLDivElement): void {
        this.window.addTo(div);
    }

    moveToLeft(editor: Editor): void {
        this.window.moveToLeft(editor);
    }

    addElement(element: HTMLElement): void {
        this.window.addElement(element);
    }
}

export default class Editor {
    width: number;
    height: number;
    private data: Array<Array<boolean>>;
    private rgbaData: Array<Uint8ClampedArray>;
    private currentCode = 0;
    private readonly div = document.createElement('div');
    private readonly header = new InfoBar();
    private readonly child = document.createElement('div');
    private readonly footer = new InfoBar();
    private readonly dock = new Dock();
    private currentScale = 0;
    private tools: Array<ToolInterface> = [
        new CanvasTool(),
        new NewTool(),
        new LoadTool(),
        new SaveTool(),
        new LoadBitmaskTool(),
        new SaveBitmaskTool(),
        new UndoTool(),
        new PasteBoardTool(),
        new WidthTool(),
        new HeightTool(),
        new PixelTool(), // index 10
        new FillTool(),
        new MoveTool(),
        new MirrorTool(),
        new ZoomTool(),
        // new ReadMeTool(),
        new FontTool(),
        new PreviewTool(),
        new SourceTool(),
        new GridTool(),
    ];
    private currentTool: number = 0;
    private encoding: Encoding = Encoding.Ascii;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.data = new Array<Array<boolean>>(256);
        this.rgbaData = new Array<Uint8ClampedArray>(256);
        const rgbaData = new Uint8ClampedArray(width * height * 4);
        for (let i = 0; i < rgbaData.length; i += 4) {
            rgbaData.set(black.rgbaData, i);
        }
        for (let i = 0; i < 256; i += 1) {
            const pixels = new Array<boolean>(width * height);
            pixels.fill(false);
            this.data[i] = pixels;
            this.rgbaData[i] = new Uint8ClampedArray(rgbaData);
        }
        this.div.style.backgroundColor = black.toString();
        this.div.style.display = 'flex';
        this.div.style.flexDirection = 'column';
        this.div.style.alignItems = 'center';
        this.div.style.justifyContent = 'center';
        this.div.style.userSelect = 'none';
        // Still required for Safari <= 17.0
        this.div.style.webkitUserSelect = 'none';
        this.div.style.overflow = 'hidden';
        this.div.style.outline = 'none';
        this.child.style.position = 'relative';
        this.child.style.touchAction = 'none';

        this.div.setAttribute('tabindex', '0');
        this.div.addEventListener('keydown', this.keyDown.bind(this));

        this.child.addEventListener('pointerdown', this.pointerDown.bind(this));
        this.child.addEventListener('pointermove', this.pointerMove.bind(this));
        this.child.addEventListener('pointerup', this.pointerUp.bind(this));

        this.header.addTo(this.div);
        this.div.appendChild(this.child);
        this.footer.addTo(this.div);

        this.addWindow(this.dock);

        window.addEventListener('resize', this.resize.bind(this));
    }

    changeFont(width: number, height: number, data: Array<Array<boolean>>) {
        this.width = width;
        this.height = height;
        this.data = data;
        const rgbaData = new Uint8ClampedArray(width * height * 4);
        for (let i = 0; i < rgbaData.length; i += 4) {
            rgbaData.set(black.rgbaData, i);
        }
        this.rgbaData = new Array<Uint8ClampedArray>(256);
        for (let i = 0; i < 256; i += 1) {
            const imageData = new Uint8ClampedArray(rgbaData);
            for (const [j, pixel] of data[i]!.entries()) {
                if (pixel) {
                    imageData.set(white.rgbaData, j * 4);
                } else {
                    imageData.set(black.rgbaData, j * 4);
                }
            }
            this.rgbaData[i] = imageData;
        }
        if (this.currentScale > this.getMaxScale()) {
            this.zoomToFit();
        } else {
            this.setScale(this.currentScale);
        }
        for (const tool of this.tools) {
            tool.changeFont?.(width, height, this);
            tool.setEncoding?.(this.encoding, this);
        }
    }

    addElementToDock(element: HTMLElement): void {
        this.dock.addElement(element);
    }

    addWindow(window: WindowInterface): void {
        window.addTo(this.div);
    }

    getMaxScale(): number {
        const { width, height } = this.div.getBoundingClientRect();
        for (let i = 1; i < 16; i += 1) {
            const power = Math.pow(2, i);
            if (
                power * this.width > width ||
                power * this.height +
                    this.header.getHeight() +
                    this.footer.getHeight() >
                    height
            ) {
                return i - 1;
            }
        }
        return 16;
    }

    setHeader(text: string | null): void {
        if (text != null) {
            this.header.setTextContent(
                `${text} (${this.width}x${this.height})`
            );
        } else {
            this.header.setTextContent(`${this.width}x${this.height}`);
        }
    }

    addTool(tool: ToolInterface): void {
        tool.init?.(this);
        this.tools.push(tool);
    }

    addOverlay(canvas: HTMLCanvasElement): void {
        canvas.style.imageRendering = 'pixelated';
        canvas.style.position = 'absolute';
        canvas.style.top = '0px';
        canvas.style.left = '0px';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        this.child.appendChild(canvas);
    }

    private blurTool(): void {
        const tool = this.tools[this.currentTool];
        tool?.blur?.(this);
    }

    setTool(tool: ToolInterface): void {
        const index = this.tools.indexOf(tool);
        if (index != -1) {
            this.blurTool();
            this.focusTool(index);
        }
    }

    private focusTool(index: number): void {
        this.blurTool();
        this.currentTool = index;
        const tool = this.tools[index];
        if (tool != null) {
            const cursor = tool.cursor;
            if (cursor != null) {
                this.child.style.cursor = cursor;
            }
            tool.focus?.(this);
        }
    }

    private keyDown(event: KeyboardEvent): void {
        const key = eventToKey(event);
        if (key.code == 'Escape') {
            this.blurTool();
            event.preventDefault();
        } else {
            for (const [index, tool] of this.tools.entries()) {
                if (tool.shortcuts != null) {
                    for (const other of tool.shortcuts) {
                        if (
                            key.code == other.code &&
                            key.cmd == other.cmd &&
                            key.shift == other.shift &&
                            (!key.repeat || (key.repeat && other.repeat))
                        ) {
                            if (
                                tool.keyDown == null ||
                                tool.keyDown(key, this)
                            ) {
                                this.focusTool(index);
                            }
                            event.preventDefault();
                            return;
                        }
                    }
                }
            }
        }
        if (key.char != null) {
            const code = findCodeInDefinitions(key.char, this.encoding);
            if (code != null) {
                this.setCode(code);
            }
        }
    }

    *enumeratePixelsFor(
        index: number
    ): IterableIterator<[Coord, boolean]> | null {
        const pixels = this.data[index];
        if (pixels == undefined) {
            return null;
        }
        let pixelIndex = 0;
        for (let y = 0; y < this.height; y += 1) {
            for (let x = 0; x < this.width; x += 1) {
                const pixel = pixels[pixelIndex]!;
                yield [new Coord(x, y), pixel];
                pixelIndex += 1;
            }
        }
    }

    *enumeratePixels(): IterableIterator<[Coord, boolean]> {
        yield* this.enumeratePixelsFor(this.currentCode)!;
    }

    getPixel(coord: Coord): boolean | undefined {
        const index = coord.toIndex(this.width);
        return this.data[this.currentCode]![index]!;
    }

    setPixel(coord: Coord, value: boolean) {
        if (coord.withinBounds(this.width, this.height)) {
            const index = coord.toIndex(this.width);
            if (this.data[this.currentCode]![index] != value) {
                const from = this.data[this.currentCode]![index]!;
                this.data[this.currentCode]![index]! = value;
                this.rgbaData[this.currentCode]!.set(
                    value ? white.rgbaData : black.rgbaData,
                    index * 4
                );
                for (const tool of this.tools) {
                    tool.change?.(coord, from, this);
                }
            }
        }
    }

    private pointerDown(event: PointerEvent): void {
        const tool = this.tools[this.currentTool];
        if (tool != null) {
            tool.pointerDown?.(this.getCoord(event), this);
        }
        this.child.setPointerCapture(event.pointerId);
    }

    private pointerMove(event: PointerEvent): void {
        const tool = this.tools[this.currentTool];
        if (tool != null) {
            tool.pointerMove?.(this.getCoord(event), this);
        }
    }

    private pointerUp(event: PointerEvent): void {
        const tool = this.tools[this.currentTool];
        if (tool != null) {
            tool.pointerUp?.(this);
        }
        if (this.child.hasPointerCapture(event.pointerId)) {
            this.child.releasePointerCapture(event.pointerId);
        }
    }

    private getCoord(event: PointerEvent): Coord {
        const rect = this.child.getBoundingClientRect();
        const pow = Math.pow(2, this.currentScale);
        const x = Math.floor((event.clientX - rect.left) / pow);
        const y = Math.floor((event.clientY - rect.top) / pow);
        const coord = new Coord(x, y);
        return coord;
    }

    scaledWidth(): number {
        return this.width * Math.pow(2, this.currentScale);
    }

    scaledHeight(): number {
        return this.height * Math.pow(2, this.currentScale);
    }

    setScale(scale: number): void {
        this.currentScale = Math.max(scale, 0);
        const width = this.scaledWidth();
        const height = this.scaledHeight();
        if (this.currentScale >= 4) {
            this.header.show();
        } else {
            this.header.hide();
        }
        if (this.currentScale >= 1) {
            this.footer.show();
        } else {
            this.footer.hide();
        }
        this.child.style.width = `${width}px`;
        this.child.style.height = `${height}px`;
        this.child.style.minWidth = `${width}px`;
        this.child.style.minHeight = `${height}px`;
        this.child.style.transition = 'all 0.1s';
        for (const tool of this.tools) {
            tool.scaled?.(this);
        }
        this.footer.setTextContent(`${Math.pow(2, this.currentScale)}x`);
    }

    getScale(): number {
        return this.currentScale;
    }

    zoomIn(): void {
        const max = this.getMaxScale();
        if (this.currentScale < max) {
            this.setScale(this.currentScale + 1);
        }
    }

    zoomOut(): void {
        this.setScale(this.currentScale - 1);
    }

    zoomToFit(): void {
        this.setScale(this.getMaxScale());
    }

    addTo(element: HTMLElement): void {
        element.appendChild(this.div);
        this.div.focus();
        this.zoomToFit();
        for (const tool of this.tools) {
            tool.init?.(this);
        }
        this.dock.moveToLeft(this);
        this.setCode(65); // 'A'
        this.focusTool(10); // Pixel tool
    }

    getData(): Array<boolean> {
        return [...this.data[this.currentCode]!];
    }

    getRgbaDataFor(index: number): Uint8ClampedArray | undefined {
        const data = this.rgbaData[index];
        if (data != undefined) {
            return new Uint8ClampedArray(data);
        } else {
            return undefined;
        }
    }

    getRgbaData(): Uint8ClampedArray {
        return this.getRgbaDataFor(this.currentCode)!;
    }

    setData(data: Array<boolean>, mode = ChangeMode.Edit): void {
        const from = this.getData();
        this.data[this.currentCode] = [...data];
        for (const [i, pixel] of data.entries()) {
            this.rgbaData[this.currentCode]!.set(
                pixel ? white.rgbaData : black.rgbaData,
                i * 4
            );
        }
        for (const tool of this.tools) {
            tool.allChange?.(from, mode, this);
        }
    }

    endChange(mode = ChangeMode.Edit): void {
        for (const tool of this.tools) {
            tool.endChange?.(mode, this);
        }
    }

    getCode(): number {
        return this.currentCode;
    }

    setCode(code: number): void {
        this.currentCode = code;
        for (const tool of this.tools) {
            tool.setCode?.(code, this);
        }
    }

    hasAnyPixelsFor(index: number): boolean | undefined {
        return this.data[index]?.some((pixel) => pixel);
    }

    hasAnyPixels(): boolean {
        return this.hasAnyPixelsFor(this.currentCode)!;
    }

    private resize(): void {
        const max = this.getMaxScale();
        if (this.currentScale > max) {
            this.setScale(max);
        }
    }

    setEncoding(encoding: Encoding): void {
        this.encoding = encoding;
        for (const tool of this.tools) {
            tool.setEncoding?.(encoding, this);
        }
    }

    getEncoding(): Encoding {
        return this.encoding;
    }

    getViewportRect(): DOMRect {
        return this.div.getBoundingClientRect();
    }

    focus(): void {
        this.div.focus();
    }

    getWidth(): number {
        return this.width;
    }

    private cropData(width: number, height: number): Array<Array<boolean>> {
        const data = new Array<Array<boolean>>(256);
        for (let i = 0; i < 256; i += 1) {
            const pixels = new Array<boolean>(width * height);
            pixels.fill(false);
            data[i] = pixels;
            for (let y = 0; y < height && y < this.height; y += 1) {
                for (let x = 0; x < width && x < this.width; x += 1) {
                    const oldIndex = y * this.width + x;
                    const newIndex = y * width + x;
                    data[i]![newIndex] = this.data[i]![oldIndex]!;
                }
            }
        }
        return data;
    }

    setWidth(width: number): void {
        const data = this.cropData(width, this.height);
        this.changeFont(width, this.height, data);
    }

    getHeight(): number {
        return this.height;
    }

    setHeight(height: number): void {
        const data = this.cropData(this.width, height);
        this.changeFont(this.width, height, data);
    }
}

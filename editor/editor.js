import Coord from './coord.js';
import { ChangeMode, Encoding, eventToKey, findCodeInDefinitions, black, white, } from './tools.js';
import InfoBar from './info_bar.js';
import { Window } from './window.js';
import UndoTool from '../tools/undo_tool.js';
import CanvasTool from '../tools/canvas_tool.js';
import GridTool from '../tools/grid_tool.js';
import PixelTool from '../tools/pixel_tool.js';
import FillTool from '../tools/fill_tool.js';
import MoveTool from '../tools/move_tool.js';
import ZoomTool from '../tools/zoom_tool.js';
import FontTool from '../tools/font_tool.js';
import ReadMeTool from '../tools/readme_tool.js';
import SaveTool from '../tools/save_tool.js';
class Dock {
    window = new Window(this);
    constructor() { }
    addTo(div) {
        this.window.addTo(div);
    }
    moveToLeft(editor) {
        this.window.moveToLeft(editor);
    }
    addElement(element) {
        this.window.addElement(element);
    }
}
export default class Editor {
    width;
    height;
    data;
    rgbaData;
    currentCode = 0;
    div = document.createElement('div');
    header = new InfoBar();
    child = document.createElement('div');
    footer = new InfoBar();
    dock = new Dock();
    currentScale = 0;
    tools = [
        new CanvasTool(),
        new PixelTool(),
        new FillTool(),
        new MoveTool(),
        new FontTool(),
        new GridTool(),
        new ZoomTool(),
        new UndoTool(),
        new SaveTool(),
        new ReadMeTool(),
    ];
    currentTool = 0;
    encoding = Encoding.Ascii;
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.data = new Array(256);
        this.rgbaData = new Array(256);
        const rgbaData = new Uint8ClampedArray(width * height * 4);
        for (let i = 0; i < rgbaData.length; i += 4) {
            rgbaData.set(black.rgbaData, i);
        }
        for (let i = 0; i < 256; i += 1) {
            const pixels = new Array(width * height);
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
    addElementToDock(element) {
        this.dock.addElement(element);
    }
    addWindow(window) {
        window.addTo(this.div);
    }
    getMaxScale() {
        const { width, height } = this.div.getBoundingClientRect();
        for (let i = 1; i < 16; i += 1) {
            const power = Math.pow(2, i);
            if (power * this.width > width ||
                power * this.height +
                    this.header.getHeight() +
                    this.footer.getHeight() >
                    height) {
                return i - 1;
            }
        }
        return 16;
    }
    setHeader(text) {
        if (text != null) {
            this.header.setTextContent(text);
            this.header.show();
        }
        else {
            this.header.hide();
        }
    }
    addTool(tool) {
        tool.init?.(this);
        this.tools.push(tool);
    }
    addOverlay(canvas) {
        canvas.style.imageRendering = 'pixelated';
        canvas.style.position = 'absolute';
        canvas.style.top = '0px';
        canvas.style.left = '0px';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        this.child.appendChild(canvas);
    }
    blurTool() {
        const tool = this.tools[this.currentTool];
        tool?.blur?.(this);
    }
    setTool(tool) {
        const index = this.tools.indexOf(tool);
        if (index != -1) {
            this.blurTool();
            this.focusTool(index);
        }
    }
    focusTool(index) {
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
    keyDown(event) {
        const key = eventToKey(event);
        if (key.code == 'Escape') {
            this.blurTool();
            event.preventDefault();
        }
        else {
            for (const [index, tool] of this.tools.entries()) {
                if (tool.shortcuts != null) {
                    for (const other of tool.shortcuts) {
                        if (key.code == other.code &&
                            key.cmd == other.cmd &&
                            key.shift == other.shift &&
                            (!key.repeat || (key.repeat && other.repeat))) {
                            if (tool.keyDown == null ||
                                tool.keyDown(key, this)) {
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
    *enumeratePixelsFor(index) {
        const pixels = this.data[index];
        if (pixels == undefined) {
            return null;
        }
        let pixelIndex = 0;
        for (let y = 0; y < this.height; y += 1) {
            for (let x = 0; x < this.width; x += 1) {
                const pixel = pixels[pixelIndex];
                yield [new Coord(x, y), pixel];
                pixelIndex += 1;
            }
        }
    }
    *enumeratePixels() {
        yield* this.enumeratePixelsFor(this.currentCode);
    }
    getPixel(coord) {
        const index = coord.toIndex(this.width);
        return this.data[this.currentCode][index];
    }
    setPixel(coord, value) {
        if (coord.withinBounds(this.width, this.height)) {
            const index = coord.toIndex(this.width);
            if (this.data[this.currentCode][index] != value) {
                const from = this.data[this.currentCode][index];
                this.data[this.currentCode][index] = value;
                this.rgbaData[this.currentCode].set(value ? white.rgbaData : black.rgbaData, index * 4);
                for (const tool of this.tools) {
                    tool.change?.(coord, from, this);
                }
            }
        }
    }
    pointerDown(event) {
        const tool = this.tools[this.currentTool];
        if (tool != null) {
            tool.pointerDown?.(this.getCoord(event), this);
        }
        this.child.setPointerCapture(event.pointerId);
    }
    pointerMove(event) {
        const tool = this.tools[this.currentTool];
        if (tool != null) {
            tool.pointerMove?.(this.getCoord(event), this);
        }
    }
    pointerUp(event) {
        const tool = this.tools[this.currentTool];
        if (tool != null) {
            tool.pointerUp?.(this);
        }
        if (this.child.hasPointerCapture(event.pointerId)) {
            this.child.releasePointerCapture(event.pointerId);
        }
    }
    getCoord(event) {
        const rect = this.child.getBoundingClientRect();
        const pow = Math.pow(2, this.currentScale);
        const x = Math.floor((event.clientX - rect.left) / pow);
        const y = Math.floor((event.clientY - rect.top) / pow);
        const coord = new Coord(x, y);
        return coord;
    }
    scaledWidth() {
        return this.width * Math.pow(2, this.currentScale);
    }
    scaledHeight() {
        return this.height * Math.pow(2, this.currentScale);
    }
    setScale(scale) {
        this.currentScale = Math.max(scale, 0);
        const width = this.scaledWidth();
        const height = this.scaledHeight();
        if (this.currentScale >= 4) {
            this.header.show();
        }
        else {
            this.header.hide();
        }
        if (this.currentScale >= 1) {
            this.footer.show();
        }
        else {
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
    getScale() {
        return this.currentScale;
    }
    zoomIn() {
        const max = this.getMaxScale();
        if (this.currentScale < max) {
            this.setScale(this.currentScale + 1);
        }
    }
    zoomOut() {
        this.setScale(this.currentScale - 1);
    }
    zoomToFit() {
        this.setScale(this.getMaxScale());
    }
    addTo(element) {
        element.appendChild(this.div);
        this.div.focus();
        this.zoomToFit();
        for (const tool of this.tools) {
            tool.init?.(this);
        }
        this.dock.moveToLeft(this);
        this.setCode(65); // 'A'
        this.focusTool(1); // Pixel tool
    }
    getData() {
        return [...this.data[this.currentCode]];
    }
    getRgbaDataFor(index) {
        const data = this.rgbaData[index];
        if (data != undefined) {
            return new Uint8ClampedArray(data);
        }
        else {
            return undefined;
        }
    }
    getRgbaData() {
        return this.getRgbaDataFor(this.currentCode);
    }
    setData(data, mode = ChangeMode.Edit) {
        const from = this.getData();
        this.data[this.currentCode] = [...data];
        for (const [i, pixel] of data.entries()) {
            this.rgbaData[this.currentCode].set(pixel ? white.rgbaData : black.rgbaData, i * 4);
        }
        for (const tool of this.tools) {
            tool.allChange?.(from, mode, this);
        }
    }
    endChange(mode = ChangeMode.Edit) {
        for (const tool of this.tools) {
            tool.endChange?.(mode, this);
        }
    }
    getCode() {
        return this.currentCode;
    }
    setCode(code) {
        this.currentCode = code;
        for (const tool of this.tools) {
            tool.setCode?.(code, this);
        }
    }
    hasAnyPixelsFor(index) {
        return this.data[index]?.some((pixel) => pixel);
    }
    hasAnyPixels() {
        return this.hasAnyPixelsFor(this.currentCode);
    }
    resize() {
        const max = this.getMaxScale();
        if (this.currentScale > max) {
            this.setScale(max);
        }
    }
    setEncoding(encoding) {
        this.encoding = encoding;
        for (const tool of this.tools) {
            tool.setEncoding?.(encoding, this);
        }
    }
    getEncoding() {
        return this.encoding;
    }
    getViewportRect() {
        return this.div.getBoundingClientRect();
    }
}
//# sourceMappingURL=editor.js.map
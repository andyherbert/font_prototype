import Coord from './coord.js';
import { ChangeMode, eventToKey, black, } from './tools.js';
import InfoBar from './info_bar.js';
import Toolbar from './toolbar.js';
import UndoTool from '../tools/undo_tool.js';
import CanvasTool from '../tools/canvas_tool.js';
import GridTool from '../tools/grid_tool.js';
import PixelTool from '../tools/pixel_tool.js';
import FillTool from '../tools/fill_tool.js';
import MoveTool from '../tools/move_tool.js';
import ZoomTool from '../tools/zoom_tool.js';
import FontTool from '../tools/font_tool.js';
class Dock {
    toolbar = new Toolbar(this);
    constructor() { }
    // close(): void {}
    addTo(div) {
        this.toolbar.addTo(div);
    }
    resetPosition() {
        this.toolbar.resetPosition();
    }
    addElement(element) {
        this.toolbar.addElement(element);
    }
}
export default class Editor {
    width;
    height;
    data;
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
        new FontTool(),
        new MoveTool(),
        new GridTool(),
        new ZoomTool(),
        new UndoTool(),
    ];
    currentTool = 0;
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.data = new Array(width * height);
        this.data.fill(false);
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
        this.div.addEventListener('keyup', this.keyUp.bind(this));
        this.child.addEventListener('pointerdown', this.pointerDown.bind(this));
        this.child.addEventListener('pointermove', this.pointerMove.bind(this));
        this.child.addEventListener('pointerup', this.pointerUp.bind(this));
        this.header.addTo(this.div);
        this.div.appendChild(this.child);
        this.footer.addTo(this.div);
        this.dock.addTo(this.div);
        window.addEventListener('resize', this.resize.bind(this));
        for (const tool of this.tools) {
            tool.init?.(this);
        }
        this.focusTool(1); // Pixel tool
    }
    addElementToDock(element) {
        this.dock.addElement(element);
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
        this.header.setTextContent(text);
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
                        }
                    }
                }
            }
        }
    }
    keyUp(event) {
        const key = eventToKey(event);
        for (const tool of this.tools) {
            if (tool.shortcuts != null) {
                for (const other of tool.shortcuts) {
                    if (key.code == other.code &&
                        key.cmd == other.cmd &&
                        key.shift == other.shift) {
                        tool.keyUp?.(key, this);
                        event.preventDefault();
                    }
                }
            }
        }
    }
    *enumeratePixels() {
        let index = 0;
        for (let y = 0; y < this.height; y += 1) {
            for (let x = 0; x < this.width; x += 1) {
                const pixel = this.data[index];
                if (pixel != null) {
                    yield [new Coord(x, y), pixel];
                }
                index += 1;
            }
        }
    }
    getPixel(coord) {
        const index = coord.toIndex(this.width);
        return this.data[index];
    }
    setPixel(coord, value) {
        if (coord.withinBounds(this.width, this.height)) {
            const index = coord.toIndex(this.width);
            if (this.data[index] != value) {
                for (const tool of this.tools) {
                    const pixel = this.data[index];
                    if (pixel != null) {
                        tool.change?.(coord, pixel, this);
                    }
                }
                this.data[index] = value;
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
        this.dock.resetPosition();
    }
    getData() {
        return [...this.data];
    }
    setData(data, mode = ChangeMode.Edit) {
        const from = this.getData();
        this.data = [...data];
        for (const tool of this.tools) {
            tool.allChange?.(from, mode, this);
        }
    }
    endChange(mode = ChangeMode.Edit) {
        for (const tool of this.tools) {
            tool.endChange?.(this, mode);
        }
    }
    resize() {
        const max = this.getMaxScale();
        if (this.currentScale > max) {
            this.setScale(max);
        }
    }
}
//# sourceMappingURL=editor.js.map
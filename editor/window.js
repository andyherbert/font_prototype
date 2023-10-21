import Coord from './coord.js';
import { black, white } from './tools.js';
export class Window {
    div = document.createElement('div');
    container = document.createElement('div');
    dragging = null;
    headerHeight = 16;
    tool;
    constructor(tool) {
        this.tool = tool;
        this.div.style.cursor = 'pointer';
        this.div.style.position = 'absolute';
        this.div.style.minWidth = '64px';
        this.div.style.minHeight = '18px';
        const from = white.toAlphaString(0.5);
        const to = white.toAlphaString(0.4);
        this.div.style.backgroundImage = `linear-gradient(to bottom, ${from}, ${to}`;
        this.div.style.backdropFilter = 'blur(24px)';
        // @ts-ignore
        this.div.style.webkitBackdropFilter = 'blur(24px)';
        this.div.style.borderRadius = '4px 4px 0px 0px';
        this.div.style.border = `1px dotted ${white.toString()}`;
        this.div.style.outline = `1px solid ${black.toString()}`;
        if (tool.close != null) {
            const close = document.createElement('div');
            close.style.margin = '6px';
            close.style.borderRadius = '2px';
            close.style.border = `1px solid ${white.toAlphaString(0.6)}`;
            close.style.backgroundColor = black.toString();
            close.style.width = '13px';
            close.style.height = '13px';
            close.addEventListener('click', this.close.bind(this));
            close.addEventListener('pointerdown', (_event) => {
                close.style.backgroundColor = white.toString();
            });
            close.addEventListener('pointerleave', (_event) => {
                close.style.backgroundColor = black.toString();
            });
            this.div.appendChild(close);
            this.container.style.margin = '4px';
        }
        else {
            const spacer = document.createElement('div');
            spacer.style.height = '22px';
            spacer.style.pointerEvents = 'none';
            this.div.appendChild(spacer);
        }
        this.div.addEventListener('pointerdown', this.pointerDown.bind(this));
        this.div.addEventListener('pointermove', this.pointerMove.bind(this));
        this.div.addEventListener('pointerup', this.pointerUp.bind(this));
        this.container.style.margin = '2px';
        this.container.style.display = 'flex';
        this.container.style.flexDirection = 'column';
        this.div.appendChild(this.container);
    }
    addElement(canvas) {
        this.container.appendChild(canvas);
    }
    close() {
        this.tool.close?.();
    }
    pointerDown(event) {
        if (event.target == this.div && this.div.parentElement != null) {
            if (this.div.parentElement.lastChild != this.div) {
                this.div.parentElement.appendChild(this.div);
            }
            const { x, y } = this.div.getBoundingClientRect();
            this.dragging = new Coord(event.clientX, event.clientY).minus(new Coord(x, y));
            this.div.setPointerCapture(event.pointerId);
        }
    }
    pointerMove(event) {
        if (this.dragging != null && this.div.parentElement != null) {
            const coord = new Coord(event.clientX, event.clientY).minus(this.dragging);
            const parentRect = this.div.parentElement.getBoundingClientRect();
            const divRect = this.div.getBoundingClientRect();
            this.setPosition(coord.limit(Math.floor(-divRect.width / 2), Math.floor(-this.headerHeight / 2), parentRect.width - Math.floor(divRect.width / 2), parentRect.height - Math.floor(this.headerHeight / 2)));
        }
    }
    pointerUp(event) {
        if (event.target == this.div) {
            this.dragging = null;
            this.div.releasePointerCapture(event.pointerId);
        }
    }
    setPosition(coord) {
        this.div.style.left = `${coord.x}px`;
        this.div.style.top = `${coord.y}px`;
    }
    addTo(element) {
        element.appendChild(this.div);
    }
    remove() {
        if (this.div.parentElement != null) {
            this.div.parentElement.removeChild(this.div);
        }
    }
    moveToLeft(_editor) {
        const x = 25;
        const y = 25;
        this.setPosition(new Coord(x, y));
    }
    moveToRight(editor) {
        const viewportRect = editor.getViewportRect();
        const divRect = this.div.getBoundingClientRect();
        const x = viewportRect.width - divRect.width - 25;
        const y = 25;
        this.setPosition(new Coord(x, y));
    }
}
//# sourceMappingURL=window.js.map
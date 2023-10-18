import Coord from './coord.js';
import { WindowInterface, black, white } from './tools.js';

export default class Window {
    private readonly div = document.createElement('div');
    private readonly container = document.createElement('div');
    private dragging: Coord | null = null;
    private headerHeight = 16;
    private tool: WindowInterface;

    constructor(tool: WindowInterface) {
        this.tool = tool;
        this.div.style.cursor = 'pointer';
        this.div.style.position = 'absolute';
        this.div.style.minWidth = '64px';
        this.div.style.minHeight = '18px';
        const from = white.toAlphaString(0.5);
        const to = white.toAlphaString(0.4);
        this.div.style.backgroundImage = `linear-gradient(to bottom, ${from}, ${to}`;
        this.div.style.backdropFilter = 'blur(10px)';
        // @ts-ignore
        this.div.style.webkitBackdropFilter = 'blur(10px)';
        this.div.style.borderRadius = '2px';
        this.div.style.border = `1px dotted ${white.toString()}`;
        this.div.style.outline = `1px solid ${black.toString()}`;
        if (tool.close != null) {
            const close = document.createElement('div');
            close.style.margin = '4px';
            close.style.borderRadius = '2px';
            close.style.border = `1px solid ${white.toAlphaString(0.6)}`;
            close.style.backgroundColor = black.toString();
            close.style.width = '8px';
            close.style.height = '8px';
            close.addEventListener('click', this.close.bind(this));
            close.addEventListener('pointerdown', (_event): void => {
                close.style.backgroundColor = white.toString();
            });
            close.addEventListener('pointerleave', (_event): void => {
                close.style.backgroundColor = black.toString();
            });
            this.div.appendChild(close);
            this.container.style.margin = '4px';
        } else {
            const spacer = document.createElement('div');
            spacer.style.height = '14px';
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

    addElement(canvas: HTMLElement): void {
        this.container.appendChild(canvas);
    }

    close(): void {
        this.tool.close?.();
    }

    private pointerDown(event: PointerEvent): void {
        if (event.target == this.div && this.div.parentElement != null) {
            if (this.div.parentElement.lastChild != this.div) {
                this.div.parentElement.appendChild(this.div);
            }
            const { x, y } = this.div.getBoundingClientRect();
            this.dragging = new Coord(event.clientX, event.clientY).minus(
                new Coord(x, y)
            );
            this.div.setPointerCapture(event.pointerId);
        }
    }

    private pointerMove(event: PointerEvent): void {
        if (this.dragging != null && this.div.parentElement != null) {
            const coord = new Coord(event.clientX, event.clientY).minus(
                this.dragging
            );
            const parentRect = this.div.parentElement.getBoundingClientRect();
            const divRect = this.div.getBoundingClientRect();
            this.setPosition(
                coord.limit(
                    Math.floor(-divRect.width / 2),
                    Math.floor(-this.headerHeight / 2),
                    parentRect.width - Math.floor(divRect.width / 2),
                    parentRect.height - Math.floor(this.headerHeight / 2)
                )
            );
        }
    }

    private pointerUp(event: PointerEvent): void {
        if (event.target == this.div) {
            this.dragging = null;
            this.div.releasePointerCapture(event.pointerId);
        }
    }

    private setPosition(coord: Coord): void {
        this.div.style.left = `${coord.x}px`;
        this.div.style.top = `${coord.y}px`;
    }

    addTo(element: HTMLElement): void {
        element.appendChild(this.div);
    }

    remove(): void {
        if (this.div.parentElement != null) {
            this.div.parentElement.removeChild(this.div);
        }
    }

    resetPosition(): void {
        if (this.div.parentElement != null) {
            const { width, height } =
                this.div.parentElement.getBoundingClientRect();
            const x = Math.floor(width / 10);
            const y = Math.floor(height / 10);
            this.setPosition(new Coord(x, y));
        }
    }
}

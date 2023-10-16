import { black } from './tools.js';

export default class InfoBar {
    private readonly height = 24;
    private readonly div = document.createElement('div');
    private readonly span = document.createElement('span');

    constructor() {
        this.div.style.fontFamily = 'system-ui, sans-serif';
        this.div.style.color = black.toString();
        this.div.style.height = `${this.height}px`;
        this.div.style.lineHeight = `${this.height}px`;
        this.div.style.fontSize = '12px';
        this.div.style.color = 'white';
        this.div.style.overflow = 'hidden';
        this.div.style.textAlign = 'center';
        this.div.style.whiteSpace = 'nowrap';
        this.div.style.textOverflow = 'ellipsis';
        this.div.appendChild(this.span);
    }

    setTextContent(text: string): void {
        this.span.textContent = text;
    }

    addTo(element: HTMLElement): void {
        element.appendChild(this.div);
    }

    show(): void {
        this.div.style.opacity = '1';
        this.div.style.transition = 'opacity 0.1s';
    }

    hide(): void {
        this.div.style.opacity = '0';
        this.div.style.transition = 'opacity 0.1s';
    }

    getHeight(): number {
        return this.height;
    }
}

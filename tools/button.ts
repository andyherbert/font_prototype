import { black, white } from '../editor/tools.js';

export default class Button {
    readonly div = document.createElement('div');
    readonly span = document.createElement('span');

    constructor(text: string) {
        this.div.style.height = '24px';
        this.div.style.fontFamily = 'system-ui, sans-serif';
        this.div.style.textAlign = 'center';
        this.div.style.fontSize = '13px';
        this.div.style.lineHeight = '24px';
        this.div.style.borderRadius = '4px';
        this.div.style.overflow = 'hidden';
        this.div.style.margin = '1px';
        this.div.style.color = black.toString();
        this.div.style.border = `1px solid ${black.toAlphaString(0.6)}`;
        this.span.textContent = text;
        this.blur();
        this.div.appendChild(this.span);
    }

    focus(): void {
        this.div.style.color = black.toString();
        this.div.style.textShadow = `0px 1px 0px ${white.toString()}`;
        this.div.style.backgroundColor = white.toString();
    }

    blur(): void {
        this.div.style.color = white.toString();
        this.div.style.textShadow = `0px 1px 0px ${black.toString()}`;
        this.div.style.backgroundColor = black.toAlphaString(0.8);
    }

    getDiv(): HTMLDivElement {
        return this.div;
    }

    addTo(div: HTMLDivElement): void {
        div.appendChild(this.div);
    }

    setText(text: string): void {
        this.span.textContent = text;
    }

    addEventListener(type: string, listener: EventListener): void {
        this.div.addEventListener(type, listener);
    }

    flash(): void {
        this.div.focus();
        this.div.animate(
            [
                { backgroundColor: white.toString() },
                { backgroundColor: black.toString() },
            ],
            {
                duration: 60,
                iterations: 1,
            }
        );
    }
}

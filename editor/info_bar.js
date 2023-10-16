import { black } from './tools.js';
export default class InfoBar {
    height = 24;
    div = document.createElement('div');
    span = document.createElement('span');
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
    setTextContent(text) {
        this.span.textContent = text;
    }
    addTo(element) {
        element.appendChild(this.div);
    }
    show() {
        this.div.style.opacity = '1';
        this.div.style.transition = 'opacity 0.1s';
    }
    hide() {
        this.div.style.opacity = '0';
        this.div.style.transition = 'opacity 0.1s';
    }
    getHeight() {
        return this.height;
    }
}
//# sourceMappingURL=info_bar.js.map
import { black, white } from './tools.js';
export class Button {
    div = document.createElement('div');
    span = document.createElement('span');
    constructor(text) {
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
    focus() {
        this.div.style.color = black.toString();
        this.div.style.textShadow = `0px 1px 0px ${white.toString()}`;
        this.div.style.backgroundColor = white.toString();
    }
    blur() {
        this.div.style.color = white.toString();
        this.div.style.textShadow = `0px 1px 0px ${black.toString()}`;
        this.div.style.backgroundColor = black.toAlphaString(0.8);
    }
    getDiv() {
        return this.div;
    }
    addTo(div) {
        div.appendChild(this.div);
    }
    setText(text) {
        this.span.textContent = text;
    }
    addEventListener(type, listener) {
        this.div.addEventListener(type, listener);
    }
    flash() {
        this.div.focus();
        this.div.animate([
            { backgroundColor: white.toString() },
            { backgroundColor: black.toString() },
        ], {
            duration: 60,
            iterations: 1,
        });
    }
}
export class ToggleButton extends Button {
    toggled = false;
    setToggle(value) {
        if (value) {
            this.div.style.backgroundColor = white.toAlphaString(0.1);
            this.div.style.textShadow = `none`;
        }
        else {
            this.blur();
        }
        this.toggled = value;
    }
    getToggle() {
        return this.toggled;
    }
}
export class NumberButton extends Button {
    decreaseButton = new Button('-');
    increaseButton = new Button('+');
    container = document.createElement('div');
    constructor(text) {
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
    addEventListenerIncrease(type, listener) {
        this.increaseButton.addEventListener(type, listener);
    }
    addEventListenerDecrease(type, listener) {
        this.decreaseButton.addEventListener(type, listener);
    }
    flashIncrease() {
        this.increaseButton.flash();
    }
    flashDecrease() {
        this.decreaseButton.flash();
    }
    getDiv() {
        return this.container;
    }
}
export class QuadButton {
    div = document.createElement('div');
    buttons = [];
    constructor(texts) {
        this.div.style.display = 'flex';
        this.div.style.flexDirection = 'row';
        this.buttons = texts.map((text) => {
            const button = new Button(text);
            button.getDiv().style.flexGrow = '1';
            button.addTo(this.div);
            return button;
        });
    }
    addEventListener(index, type, listener) {
        this.buttons[index]?.addEventListener(type, listener);
    }
    flash(index) {
        this.buttons[index]?.flash();
    }
    getDiv() {
        return this.div;
    }
}
export class LoadButton extends Button {
    input = document.createElement('input');
    label = document.createElement('label');
    constructor(text, accept) {
        super(text);
        this.input.type = 'file';
        this.input.accept = accept;
        this.input.style.display = 'none';
        this.label.appendChild(this.input);
        this.div.style.position = 'relative';
        this.label.style.position = 'absolute';
        this.label.style.top = '0px';
        this.label.style.left = '0px';
        this.label.style.width = '100%';
        this.label.style.height = '100%';
        this.div.appendChild(this.label);
    }
    addEventListener(type, listener) {
        this.label.addEventListener(type, listener);
    }
    addFileListener(listener) {
        this.input.addEventListener('change', listener);
    }
    getFile() {
        const file = this.input.files?.[0];
        if (file == undefined) {
            return null;
        }
        this.input.value = '';
        return file;
    }
}
//# sourceMappingURL=button.js.map
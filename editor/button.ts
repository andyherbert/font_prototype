import { black, white } from './tools.js';

export class Button {
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

export class ToggleButton extends Button {
    private toggled = false;

    setToggle(value: boolean) {
        if (value) {
            this.div.style.backgroundColor = white.toAlphaString(0.1);
            this.div.style.textShadow = `none`;
        } else {
            this.blur();
        }
        this.toggled = value;
    }

    getToggle(): boolean {
        return this.toggled;
    }
}

export class NumberButton extends Button {
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

export class QuadButton {
    private readonly div = document.createElement('div');
    private readonly buttons: Button[] = [];

    constructor(texts: [string, string, string, string]) {
        this.div.style.display = 'flex';
        this.div.style.flexDirection = 'row';
        this.buttons = texts.map((text): Button => {
            const button = new Button(text);
            button.getDiv().style.flexGrow = '1';
            button.addTo(this.div);
            return button;
        });
    }

    addEventListener(
        index: number,
        type: string,
        listener: EventListener
    ): void {
        this.buttons[index]?.addEventListener(type, listener);
    }

    flash(index: number): void {
        this.buttons[index]?.flash();
    }

    getDiv(): HTMLDivElement {
        return this.div;
    }
}

export class LoadButton extends Button {
    private readonly input = document.createElement('input');
    private readonly label = document.createElement('label');

    constructor(text: string) {
        super(text);
        this.input.type = 'file';
        this.input.accept = '.png';
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

    override addEventListener(type: string, listener: EventListener): void {
        this.label.addEventListener(type, listener);
    }

    addFileListener(listener: EventListener): void {
        this.input.addEventListener('change', listener);
    }

    getFile(): File | null {
        const file = this.input.files?.[0];
        if (file == undefined) {
            return null;
        }
        this.input.value = '';
        return file;
    }
}

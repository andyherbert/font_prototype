import Editor from '../editor/editor.js';
import Button from './button.js';
import {
    ToolInterface,
    WindowInterface,
    black,
    white,
} from '../editor/tools.js';
import Window from '../editor/toolbar.js';

class TextWindow implements WindowInterface {
    private readonly window = new Window(this);
    private readonly button: ReadMeButton;

    constructor(button: ReadMeButton, url: string) {
        this.button = button;
        const pre = document.createElement('pre');
        pre.style.width = '640px';
        pre.style.height = '200px';
        pre.style.fontFamily = 'ui-monospace, monospace';
        pre.style.fontSize = '13px';
        pre.style.color = white.toString();
        pre.style.backgroundColor = black.toAlphaString(0.8);
        pre.style.margin = '0px';
        pre.style.padding = '6px';
        pre.style.overflow = 'auto';
        this.window.addElement(pre);
        fetchText(url).then((text): void => {
            pre.textContent = text;
        });
    }

    addTo(div: HTMLDivElement): void {
        this.window.addTo(div);
    }

    remove(): void {
        this.window.remove();
    }

    resetPosition(): void {
        this.window.resetPosition();
    }

    close(): void {
        this.remove();
        this.button.toggle();
    }
}

class ReadMeButton extends Button {
    private toggled = false;

    toggle(): boolean {
        this.toggled = !this.toggled;
        if (this.toggled) {
            this.div.style.backgroundColor = white.toAlphaString(0.1);
            this.div.style.textShadow = `none`;
        } else {
            this.blur();
        }
        return this.toggled;
    }
}

async function fetchText(url: string): Promise<string> {
    const response = await fetch(url);
    return await response.text();
}

export default class ReadMeTool implements ToolInterface {
    name = 'ReadMe';
    private readonly button = new ReadMeButton('ReadMe');
    private readonly toolbar = new TextWindow(this.button, './README.txt');

    init(editor: Editor): void {
        editor.addElementToDock(this.button.getDiv());
        this.button.addEventListener('click', (): void => {
            const toggled = this.button.toggle();
            if (toggled) {
                editor.addWindow(this.toolbar);
            } else {
                this.toolbar.remove();
            }
        });
    }
}

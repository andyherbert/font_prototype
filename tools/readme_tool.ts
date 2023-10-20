import Editor from '../editor/editor.js';
import { ToggleButton } from '../editor/button.js';
import { ToolInterface, black, white } from '../editor/tools.js';
import { Window, WindowInterface } from '../editor/window.js';

class TextWindow implements WindowInterface {
    private readonly window = new Window(this);
    private readonly button: ToggleButton;

    constructor(button: ToggleButton, url: string) {
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

    moveToLeft(editor: Editor): void {
        this.window.moveToLeft(editor);
    }

    close(): void {
        this.window.remove();
        this.button.setToggle(false);
    }
}

async function fetchText(url: string): Promise<string> {
    const response = await fetch(url);
    return await response.text();
}

export default class ReadMeTool implements ToolInterface {
    name = 'ReadMe';
    private readonly button = new ToggleButton('ReadMe');
    private readonly window = new TextWindow(this.button, './README.txt');

    init(editor: Editor): void {
        editor.addElementToDock(this.button.getDiv());
        this.button.addEventListener('pointerdown', (): void => {
            const toggled = this.button.getToggle();
            if (toggled) {
                this.window.close();
                this.button.setToggle(false);
            } else {
                editor.addWindow(this.window);
                this.button.setToggle(true);
            }
        });
    }
}

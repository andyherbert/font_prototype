import Button from './button.js';
import { black, white, } from '../editor/tools.js';
import Window from '../editor/toolbar.js';
class TextWindow {
    window = new Window(this);
    button;
    constructor(button, url) {
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
        fetchText(url).then((text) => {
            pre.textContent = text;
        });
    }
    addTo(div) {
        this.window.addTo(div);
    }
    remove() {
        this.window.remove();
    }
    resetPosition() {
        this.window.resetPosition();
    }
    close() {
        this.remove();
        this.button.toggle();
    }
}
class ReadMeButton extends Button {
    toggled = false;
    toggle() {
        this.toggled = !this.toggled;
        if (this.toggled) {
            this.div.style.backgroundColor = white.toAlphaString(0.1);
            this.div.style.textShadow = `none`;
        }
        else {
            this.blur();
        }
        return this.toggled;
    }
}
async function fetchText(url) {
    const response = await fetch(url);
    return await response.text();
}
export default class ReadMeTool {
    name = 'ReadMe';
    button = new ReadMeButton('ReadMe');
    toolbar = new TextWindow(this.button, './README.txt');
    init(editor) {
        editor.addElementToDock(this.button.getDiv());
        this.button.addEventListener('click', () => {
            const toggled = this.button.toggle();
            if (toggled) {
                editor.addWindow(this.toolbar);
            }
            else {
                this.toolbar.remove();
            }
        });
    }
}
//# sourceMappingURL=readme_tool.js.map
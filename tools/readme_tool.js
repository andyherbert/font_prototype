import { ToggleButton } from '../editor/button.js';
import { black, white } from '../editor/tools.js';
import { Window } from '../editor/window.js';
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
    resetPosition() {
        this.window.resetPosition();
    }
    close() {
        this.window.remove();
        this.button.setToggle(false);
    }
}
async function fetchText(url) {
    const response = await fetch(url);
    return await response.text();
}
export default class ReadMeTool {
    name = 'ReadMe';
    button = new ToggleButton('ReadMe');
    window = new TextWindow(this.button, './README.txt');
    init(editor) {
        editor.addElementToDock(this.button.getDiv());
        this.button.addEventListener('pointerdown', () => {
            const toggled = this.button.getToggle();
            if (toggled) {
                this.window.close();
                this.button.setToggle(false);
            }
            else {
                editor.addWindow(this.window);
                this.button.setToggle(true);
            }
        });
    }
}
//# sourceMappingURL=readme_tool.js.map
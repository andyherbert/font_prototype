import { Button } from '../editor/button.js';
export default class NewTool {
    name = 'New';
    button = new Button('New');
    init(editor) {
        editor.addElementToDock(this.button.getDiv());
        this.button.addEventListener('pointerdown', () => {
            this.button.flash();
            this.newFont(editor.width, editor.height, editor);
        });
    }
    newFont(width, height, editor) {
        const data = new Array(256);
        for (let i = 0; i < 256; i++) {
            data[i] = new Array(width * height).fill(false);
        }
        editor.changeFont(width, height, data);
    }
}
//# sourceMappingURL=new_tool.js.map
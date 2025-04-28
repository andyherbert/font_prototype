import { Button } from '../editor/button.js';
export default class SourceTool {
    name = 'Source';
    button = new Button('Source');
    init(editor) {
        editor.addElementToDock(this.button.getDiv());
        this.button.addEventListener('pointerdown', () => {
            this.button.flash();
            const a = document.createElement('a');
            a.href = 'https://github.com/andyherbert/font_prototype';
            a.click();
        });
    }
}
//# sourceMappingURL=source_tool.js.map
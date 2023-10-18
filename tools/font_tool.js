import { black, gray, white, } from '../editor/tools.js';
import { ToggleButton } from '../editor/button.js';
import { Window } from '../editor/window.js';
const controlCharacters = [
    'Null',
    'Start of Heading',
    'Start of Text',
    'End of Text',
    'End of Transmission',
    'Enquiry',
    'Acknowledge',
    'Bell',
    'Backspace',
    'Horizontal Tabulation',
    'Line Feed',
    'Vertical Tabulation',
    'Form Feed',
    'Carriage Return',
    'Shift Out',
    'Shift In',
    'Data Link Escape',
    'Device Control 1',
    'Device Control 2',
    'Device Control 3',
    'Device Control 4',
    'Negative Acknowledge',
    'Synchronous Idle',
    'End of Transmission Block',
    'Cancel',
    'End of Medium',
    'Substitute',
    'Escape',
    'File Separator',
    'Group Separator',
    'Record Separator',
    'Unit Separator',
];
const ascii = [
    ...controlCharacters,
    'Space',
    'Exclamation Point',
    'Quotation Marks (Diaeresis)',
    'Number Sign',
    'Dollar Sign',
    'Percent Sign',
    'Ampersand',
    'Apostrophe',
    'Opening Parenthesis',
    'Closing Parenthesis',
    'Asterisk',
    'Plus',
    'Comma (Cedilla)',
    'Hyphen (Minus)',
    'Period (Decimal Point)',
    'Slant',
    'Digit 0',
    'Digit 1',
    'Digit 2',
    'Digit 3',
    'Digit 4',
    'Digit 5',
    'Digit 6',
    'Digit 7',
    'Digit 8',
    'Digit 9',
    'Colon',
    'Semicolon',
    'Less Than',
    'Equals',
    'Greater Than',
    'Question Mark',
    'Commercial At',
    'Uppercase A',
    'Uppercase B',
    'Uppercase C',
    'Uppercase D',
    'Uppercase E',
    'Uppercase F',
    'Uppercase G',
    'Uppercase H',
    'Uppercase I',
    'Uppercase J',
    'Uppercase K',
    'Uppercase L',
    'Uppercase M',
    'Uppercase N',
    'Uppercase O',
    'Uppercase P',
    'Uppercase Q',
    'Uppercase R',
    'Uppercase S',
    'Uppercase T',
    'Uppercase U',
    'Uppercase V',
    'Uppercase W',
    'Uppercase X',
    'Uppercase Y',
    'Uppercase Z',
    'Opening Bracket',
    'Reverse Slant',
    'Closing Bracket',
    'Circumflex',
    'Underline',
    'Grave Accent',
    'Lowercase A',
    'Lowercase B',
    'Lowercase C',
    'Lowercase D',
    'Lowercase E',
    'Lowercase F',
    'Lowercase G',
    'Lowercase H',
    'Lowercase I',
    'Lowercase J',
    'Lowercase K',
    'Lowercase L',
    'Lowercase M',
    'Lowercase N',
    'Lowercase O',
    'Lowercase P',
    'Lowercase Q',
    'Lowercase R',
    'Lowercase S',
    'Lowercase T',
    'Lowercase U',
    'Lowercase V',
    'Lowercase W',
    'Lowercase X',
    'Lowercase Y',
    'Lowercase Z',
    'Opening Brace',
    'Vertical Line',
    'Closing Brace',
    'Tilde',
    'Delete',
];
// @ts-ignore
const iso8859_1 = [
    ...ascii,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    'No-Break Space',
    'Inverted Exclamation Mark',
    'Cent Sign',
    'Pound Sign',
    'Currency Sign',
    'Yen Sign',
    'Broken Bar',
    'Section Sign',
    'Diaeresis',
    'Copyright Sign',
    'Feminine Ordinal Indicator',
    'Left-Pointing Double Angle Quotation Mark',
    'Not Sign',
    'Soft Hyphen',
    'Registered Sign',
    'Macron',
    'Degree Sign',
    'Plus-Minus Sign',
    'Superscript Two',
    'Superscript Three',
    'Acute Accent',
    'Micro Sign',
    'Pilcrow Sign',
    'Middle Dot',
    'Cedilla',
    'Superscript One',
    'Masculine Ordinal Indicator',
    'Right-Pointing Double Angle Quotation Mark',
    'Vulgar Fraction One Quarter',
    'Vulgar Fraction One Half',
    'Vulgar Fraction Three Quarters',
    'Inverted Question Mark',
    'Uppercase A With Grave',
    'Uppercase A With Acute',
    'Uppercase A With Circumflex',
    'Uppercase A With Tilde',
    'Uppercase A With Diaeresis',
    'Uppercase A With Ring Above',
    'Uppercase AE',
    'Uppercase C With Cedilla',
    'Uppercase E With Grave',
    'Uppercase E With Acute',
    'Uppercase E With Circumflex',
    'Uppercase E With Diaeresis',
    'Uppercase I With Grave',
    'Uppercase I With Acute',
    'Uppercase I With Circumflex',
    'Uppercase | With Diaeresis',
    'Uppercase Eth',
    'Uppercase N With Tilde',
    'Uppercase O With Grave',
    'Uppercase O With Acute',
    'Uppercase O With Circumflex',
    'Uppercase O With Tilde',
    'Uppercase O With Diaeresis',
    'Multiplication Sign',
    'Uppercase O With Stroke',
    'Uppercase U With Grave',
    'Uppercase U With Acute',
    'Uppercase U With Circumflex',
    'Uppercase U With Diaeresis',
    'Uppercase Y With Acute',
    'Uppercase Thorn',
    'Lowercase Sharp S',
    'Lowercase A With Grave',
    'Lowercase A With Acute',
    'Lowercase A With Circumflex',
    'Lowercase A With Tilde',
    'Lowercase A With Diaeresis',
    'Lowercase A With Ring Above',
    'Lowercase AE',
    'Lowercase C With Cedilla',
    'Lowercase E With Grave',
    'Lowercase E With Acute',
    'Lowercase E With Circumflex',
    'Lowercase E With Diaeresis',
    'Lowercase I With Grave',
    'Lowercase I With Acute',
    'Lowercase I With Circumflex',
    'Lowercase I With Diaeresis',
    'Lowercase Eth',
    'Lowercase N With Tilde',
    'Lowercase O With Grave',
    'Lowercase O With Acute',
    'Lowercase O With Circumflex',
    'Lowercase O With Tilde',
    'Lowercase O With Diaeresis',
    'Division Sign',
    'Lowercase O With Stroke',
    'Lowercase U With Grave',
    'Lowercase U With Acute',
    'Lowercase U With Circumflex',
    'Lowercase U With Diaeresis',
    'Lowercase Y With Acute',
    'Lowercase Thorn',
    'Lowercase Y With Diaeresis',
];
// @ts-ignore
const windows1252 = [
    ...ascii,
    'Euro Sign',
    null,
    'Single Low-9 Quotation Mark',
    'Lowercase F With Hook',
    'Double Low-9 Quotation Mark',
    'Horizontal Ellipsis',
    'Dagger',
    'Double Dagger',
    'Modifier Letter Circumflex Accent',
    'Per Mille Sign',
    'Uppercase S With Caron',
    'Single Left-Pointing Angle Quotation Mark',
    'Latin Capital Ligature OE',
    null,
    'Uppercase Z With Caron',
    null,
    null,
    'Left Single Quotation Mark',
    'Right Single Quotation Mark',
    'Left Double Quotation Mark',
    'Right Double Quotation Mark',
    'Bullet',
    'En Dash',
    'Em Dash',
    'Small Tilde',
    'Trade Mark Sign',
    'Lowercase S With Caron',
    'Single Right-Pointing Angle Quotation Mark',
    'Latin Small Ligature OE',
    null,
    'Lowercase Z With Caron',
    'Uppercase Y With Diaeresis',
    'No-Break Space',
    'Inverted Exclamation Mark',
    'Cent Sign',
    'Pound Sign',
    'Currency Sign',
    'Yen Sign',
    'Broken Bar',
    'Section Sign',
    'Diaeresis',
    'Copyright Sign',
    'Feminine Ordinal Indicator',
    'Left-Pointing Double Angle Quotation Mark',
    'Not Sign',
    'Soft Hyphen',
    'Registered Sign',
    'Macron',
    'Degree Sign',
    'Plus-Minus Sign',
    'Superscript Two',
    'Superscript Three',
    'Acute Accent',
    'Micro Sign',
    'Pilcrow Sign',
    'Middle Dot',
    'Cedilla',
    'Superscript One',
    'Masculine Ordinal Indicator',
    'Right-Pointing Double Angle Quotation Mark',
    'Vulgar Fraction One Quarter',
    'Vulgar Fraction One Half',
    'Vulgar Fraction Three Quarters',
    'Inverted Question Mark',
    'Uppercase A With Grave',
    'Uppercase A With Acute',
    'Uppercase A With Circumflex',
    'Uppercase A With Tilde',
    'Uppercase A With Diaeresis',
    'Uppercase A With Ring Above',
    'Uppercase AE',
    'Uppercase C With Cedilla',
    'Uppercase E With Grave',
    'Uppercase E With Acute',
    'Uppercase E With Circumflex',
    'Uppercase E With Diaeresis',
    'Uppercase I With Grave',
    'Uppercase I With Acute',
    'Uppercase I With Circumflex',
    'Uppercase I With Diaeresis',
    'Uppercase Eth',
    'Uppercase N With Tilde',
    'Uppercase O With Grave',
    'Uppercase O With Acute',
    'Uppercase O With Circumflex',
    'Uppercase O With Tilde',
    'Uppercase O With Diaeresis',
    'Multiplication Sign',
    'Uppercase O With Stroke',
    'Uppercase U With Grave',
    'Uppercase U With Acute',
    'Uppercase U With Circumflex',
    'Uppercase U With Diaeresis',
    'Uppercase Y With Acute',
    'Uppercase Thorn',
    'Lowercase Sharp S',
    'Lowercase A With Grave',
    'Lowercase A With Acute',
    'Lowercase A With Circumflex',
    'Lowercase A With Tilde',
    'Lowercase A With Diaeresis',
    'Lowercase A With Ring Above',
    'Lowercase AE',
    'Lowercase C With Cedilla',
    'Lowercase E With Grave',
    'Lowercase E With Acute',
    'Lowercase E With Circumflex',
    'Lowercase E With Diaeresis',
    'Lowercase I With Grave',
    'Lowercase I With Acute',
    'Lowercase I With Circumflex',
    'Lowercase I With Diaeresis',
    'Lowercase Eth',
    'Lowercase N With Tilde',
    'Lowercase O With Grave',
    'Lowercase O With Acute',
    'Lowercase O With Circumflex',
    'Lowercase O With Tilde',
    'Lowercase O With Diaeresis',
    'Division Sign',
    'Lowercase O With Stroke',
    'Lowercase U With Grave',
    'Lowercase U With Acute',
    'Lowercase U With Circumflex',
    'Lowercase U With Diaeresis',
    'Lowercase Y With Acute',
    'Lowercase Thorn',
    'Lowercase Y With Diaeresis',
];
// console.log(iso8859_1.length);
// console.log(iso8859_1.length);
class FontWindow {
    window = new Window(this);
    button;
    div = document.createElement('div');
    canvas = document.createElement('canvas');
    selectedDiv = document.createElement('div');
    canvases = new Array();
    constructor(button) {
        this.button = button;
        this.div.style.position = 'relative';
        this.div.style.backgroundColor = 'red';
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0px';
        this.canvas.style.left = '0px';
        this.canvas.style.imageRendering = 'pixelated';
        this.div.appendChild(this.canvas);
        this.window.addElement(this.div);
        this.selectedDiv.style.position = 'absolute';
        this.selectedDiv.style.border = `1px solid ${white.toString()}`;
        this.selectedDiv.style.borderRadius = '2px';
        this.div.appendChild(this.selectedDiv);
        for (let i = 0; i < 256; i++) {
            const canvas = document.createElement('canvas');
            canvas.style.position = 'absolute';
            canvas.style.imageRendering = 'pixelated';
            canvas.style.pointerEvents = 'none';
            this.canvases.push(canvas);
            this.div.appendChild(canvas);
        }
    }
    getCanvas() {
        return this.canvas;
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
    redraw(editor, scale = 3) {
        const width = (editor.width * 16 + 16) * scale;
        const height = (editor.height * 16 + 16) * scale;
        this.div.style.width = `${width}px`;
        this.div.style.height = `${height}px`;
        this.canvas.height = height;
        this.canvas.width = width;
        const ctx = this.canvas.getContext('2d');
        if (ctx != null) {
            ctx.fillStyle = black.toString();
            ctx.fillRect(0, 0, width, height);
            const imageDataHorizontal = ctx.createImageData(width, 1);
            for (let i = 0; i < width * 4; i += 4) {
                if (i % 8 == 0) {
                    imageDataHorizontal.data.set(gray.rgbaData, i);
                }
                else {
                    imageDataHorizontal.data.set(black.rgbaData, i);
                }
            }
            for (let y = (editor.height + 1) * scale; y < height; y += (editor.height + 1) * scale) {
                ctx.putImageData(imageDataHorizontal, 0, y);
            }
            const imageDataVertical = ctx.createImageData(1, height);
            for (let i = 0; i < width * 4; i += 4) {
                if (i % 8 == 0) {
                    imageDataVertical.data.set(gray.rgbaData, i);
                }
                else {
                    imageDataVertical.data.set(black.rgbaData, i);
                }
            }
            for (let x = (editor.width + 1) * scale; x < width; x += (editor.width + 1) * scale) {
                ctx.putImageData(imageDataVertical, x, 0);
            }
            ctx.font = '18px ui-monospace, monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = gray.toString();
            let code = 0;
            for (let y = 0; y < 16; y += 1) {
                for (let x = 0; x < 16; x += 1) {
                    if (code > 32 && code < 127) {
                        const px = Math.floor((x + 0.5) * editor.width * scale) +
                            x * scale;
                        const py = Math.floor((y + 0.5) * editor.height * scale) +
                            y * scale +
                            2;
                        const char = String.fromCharCode(code);
                        ctx.fillText(char, px, py);
                    }
                    const canvas = this.canvases[code];
                    canvas.width = editor.width;
                    canvas.height = editor.height;
                    canvas.style.width = `${editor.width * scale}px`;
                    canvas.style.height = `${editor.height * scale}px`;
                    canvas.style.left = `${(x * (editor.width + 1) + 1) * scale}px`;
                    canvas.style.top = `${(y * (editor.height + 1) + 1) * scale}px`;
                    code += 1;
                }
            }
        }
    }
    resize(editor) {
        this.redraw(editor);
    }
    change(editor) {
        const canvas = this.canvases[editor.getCode()];
        if (editor.hasAnyPixels()) {
            canvas.style.opacity = '1';
            const ctx = canvas.getContext('2d');
            const imageData = ctx.createImageData(canvas.width, canvas.height);
            imageData.data.set(editor.getRgbaData());
            ctx.putImageData(imageData, 0, 0);
        }
        else {
            canvas.style.opacity = '0';
        }
    }
    setCode(code, editor, scale = 3) {
        const x = code % 16;
        const y = Math.floor(code / 16);
        const px = x * (editor.width + 1) * scale;
        const py = y * (editor.height + 1) * scale;
        this.selectedDiv.style.left = `${px}px`;
        this.selectedDiv.style.top = `${py}px`;
        this.selectedDiv.style.width = `${(editor.width + 1) * scale}px`;
        this.selectedDiv.style.height = `${(editor.height + 1) * scale}px`;
    }
}
export default class FontTool {
    name = 'Font';
    button = new ToggleButton('Font');
    window = new FontWindow(this.button);
    init(editor) {
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
        editor.addElementToDock(this.button.getDiv());
        this.window.redraw(editor);
        const canvas = this.window.getCanvas();
        canvas.addEventListener('pointerdown', (event) => {
            const rect = canvas.getBoundingClientRect();
            const fontWidth = rect.width / 16;
            const fontHeight = rect.height / 16;
            const x = Math.floor((event.clientX - rect.left) / fontWidth);
            const y = Math.floor((event.clientY - rect.top) / fontHeight);
            editor.setCode(x + y * 16);
        });
    }
    setCode(code, editor) {
        this.window.setCode(code, editor);
        const name = ascii[code];
        if (name != null) {
            editor.setHeader(name);
        }
        else {
            editor.setHeader('');
        }
    }
    change(_coord, _from, editor) {
        if (this.button.getToggle()) {
            this.window.change(editor);
        }
    }
    allChange(_from, _mode, editor) {
        if (this.button.getToggle()) {
            this.window.change(editor);
        }
    }
}
//# sourceMappingURL=font_tool.js.map
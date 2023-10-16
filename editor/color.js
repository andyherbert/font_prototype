export default class Color {
    red;
    green;
    blue;
    rgbaData;
    constructor(red, green, blue) {
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.rgbaData = new Uint8ClampedArray([red, green, blue, 255]);
    }
    toString() {
        return `rgb(${this.red}, ${this.green}, ${this.blue})`;
    }
    toAlphaString(alpha) {
        return `rgb(${this.red}, ${this.green}, ${this.blue}, ${alpha})`;
    }
}
//# sourceMappingURL=color.js.map
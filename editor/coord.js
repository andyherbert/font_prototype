export default class Coord {
    x;
    y;
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    limit(minX, minY, maxX, maxY) {
        return new Coord(Math.min(Math.max(this.x, minX), maxX), Math.min(Math.max(this.y, minY), maxY));
    }
    withinBounds(width, height) {
        return this.x >= 0 && this.x < width && this.y >= 0 && this.y < height;
    }
    eq(other) {
        return this.x == other.x && this.y == other.y;
    }
    neq(other) {
        return this.x != other.x || this.y != other.y;
    }
    minus(other) {
        return new Coord(this.x - other.x, this.y - other.y);
    }
    add(x, y) {
        return new Coord(this.x + x, this.y + y);
    }
    toIndex(width) {
        return this.y * width + this.x;
    }
}
//# sourceMappingURL=coord.js.map
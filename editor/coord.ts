export default class Coord {
    readonly x: number;
    readonly y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    limit(minX: number, minY: number, maxX: number, maxY: number): Coord {
        return new Coord(
            Math.min(Math.max(this.x, minX), maxX),
            Math.min(Math.max(this.y, minY), maxY)
        );
    }

    withinBounds(width: number, height: number): boolean {
        return this.x >= 0 && this.x < width && this.y >= 0 && this.y < height;
    }

    eq(other: Coord): boolean {
        return this.x == other.x && this.y == other.y;
    }

    neq(other: Coord): boolean {
        return this.x != other.x || this.y != other.y;
    }

    minus(other: Coord): Coord {
        return new Coord(this.x - other.x, this.y - other.y);
    }

    add(x: number, y: number): Coord {
        return new Coord(this.x + x, this.y + y);
    }

    toIndex(width: number): number {
        return this.y * width + this.x;
    }
}

import {CX, CY} from "./walls.mjs"

class Direction {
    _name = "";
    _code = 0;
    _dX = 0;
    _dY = 0;

    constructor(name, code, dx, dy) {
        this._name = name;
        this._code = code;
        this._dX = dx;
        this._dY = dy;
    }

    get dX() {
        return this._dX;
    }

    get dY() {
        return this._dY;
    }

    get name() {
        return this._name;
    }

    get code() {
        return this._code;
    }

    Transform(coord, scale = 10) {
        return {
            x: coord[CX] + this.dX * scale,
            y: coord[CY] + this.dY * scale
        }
    }
}

export default class Directions {
    static Left  =  new Direction("left", 37, -1, 0);
    static Right = new Direction("right", 39, 1, 0);
    static Up = new Direction("up", 38, 0, -1);
    static Down = new Direction("down", 40, 0, 1);

    static GetDirection(keyCode) {
        switch(keyCode) {
        case this.Left.code:
            return this.Left;
        case this.Up.code:
            return this.Up;
        case this.Right.code:
            return this.Right;
        case this.Down.code:
            return this.Down;
        default:
            return 0;
        }
    }
};
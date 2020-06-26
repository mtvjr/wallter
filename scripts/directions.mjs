import {CX, CY} from "./walls.mjs"

class Direction {
    _name = "";
    _code = 0;
    _dX = 0;
    _dY = 0;

    constructor(data) {
        this._name = data.name;
        this._code = data.code;
        this._dX = data.dx;
        this._dY = data.dy;
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

    static Up = new Direction({
        name: "up",
        code: "ArrowUp",
        dx: 0,
        dy:-1
    });

    static Down = new Direction({
        name:"down",
        code: "ArrowDown",
        dx: 0,
        dy: 1
    });

    static Left  =  new Direction({
        name:"left",
        code: "ArrowLeft",
        dx: -1,
        dy: 0
    });

    static Right = new Direction({
        name:"right",
        code: "ArrowRight",
        dx: 1,
        dy: 0
    });

    static GetDirection(code) {
        switch(code) {
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
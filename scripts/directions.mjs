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

    transform(coord, scale = 10) {
        return {
            x: coord[CX] + this.dX * scale,
            y: coord[CY] + this.dY * scale
        }
    }
}

export default class Directions {

    static UP = new Direction({
        name: "up",
        code: "ArrowUp",
        dx: 0,
        dy:-1
    });

    static DOWN = new Direction({
        name:"down",
        code: "ArrowDown",
        dx: 0,
        dy: 1
    });

    static LEFT  =  new Direction({
        name:"left",
        code: "ArrowLeft",
        dx: -1,
        dy: 0
    });

    static RIGHT = new Direction({
        name:"right",
        code: "ArrowRight",
        dx: 1,
        dy: 0
    });

    static getDirection(code) {
        switch(code) {
        case this.LEFT.code:
            return this.LEFT;
        case this.UP.code:
            return this.UP;
        case this.RIGHT.code:
            return this.RIGHT;
        case this.DOWN.code:
            return this.DOWN;
        default:
            return 0;
        }
    }
};
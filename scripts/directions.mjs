import {CX, CY} from "./walls.mjs"

class Direction {
    _name = "";
    _dX = 0;
    _dY = 0;

    constructor(data) {
        this._name = data.name;
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
        dx: 0,
        dy:-1
    });

    static DOWN = new Direction({
        name:"down",
        dx: 0,
        dy: 1
    });

    static LEFT  =  new Direction({
        name:"left",
        dx: -1,
        dy: 0
    });

    static RIGHT = new Direction({
        name:"right",
        dx: 1,
        dy: 0
    });
};
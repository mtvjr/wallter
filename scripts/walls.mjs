import Logger from "./common/logger.mjs"

export const CX = 0;
export const CY = 1;

class EndPoint {
    _index;

    constructor(num) {
        this._index = (num - 1) * 2;
    }

    get index() {
        return this._index;
    }

    get num() {
        return (this._index / 2) + 1;
    }

    get X() {
        return this._index + CX;
    }

    get Y() {
        return this._index + CY;
    }

    GetCoord(pair) {
        return [ pair[this.X], pair[this.Y] ]
    }
}

const EP1 = new EndPoint(1);
const EP2 = new EndPoint(2);

class OrderedEndpoints {
    _topleft;
    _btmright;

    constructor(topleft, btmright) {
        this._topleft = topleft;
        this._btmright = btmright;
    }

    get TopLeft() {
        return this._topleft;
    }

    get BottomRight() {
        return this._btmright;
    }

    RecreateCoordPair(tlCoord, brCoord) {
        let arr = [0, 0, 0, 0];
        arr[this.TopLeft.X] = tlCoord[CX];
        arr[this.TopLeft.Y] = tlCoord[CY];
        arr[this.BottomRight.X] = brCoord[CX];
        arr[this.BottomRight.Y] = brCoord[CY];
        return arr;
    }
}

function GetEndpointOrder(coordPair) {
    // Check Top / Bottom First
    if (coordPair[EP1.Y] != coordPair[EP2.Y]) {
        // Return the higher endpoint
        if (coordPair[EP1.Y] < coordPair[EP2.Y]) {
            return new OrderedEndpoints(EP1, EP2)
        } else {
            return new OrderedEndpoints(EP2, EP1);
        }
    } else {
        // Same height, check against left right
        // Return the left-most endpoint
        if (coordPair[EP1.X] <= coordPair[EP2.X]) {
            return new OrderedEndpoints(EP1, EP2)
        } else {
            return new OrderedEndpoints(EP2, EP1);
        }
    }
}

export function MoveControlledWalls(direction) {
    const updates = canvas.walls.controlled.map((wall) => {
        let c = wall.data.c;

        let p0 = wall.layer._getWallEndpointCoordinates(
            direction.Transform(EP1.GetCoord(c))
        );

        let p1 = wall.layer._getWallEndpointCoordinates(
            direction.Transform(EP2.GetCoord(c))
        );

        return {_id: wall.id, c: p0.concat(p1)};
    });

    canvas.scene.updateEmbeddedEntity("Wall", updates);
}

export function MoveControlledTopLeft(direction) {
    const updates = canvas.walls.controlled.map( (wall) => {
        const c = wall.data.c;
        const order = GetEndpointOrder(wall.data.c);

        const tl = wall.layer._getWallEndpointCoordinates(
            direction.Transform(
                order.TopLeft.GetCoord(c)
            )
        );

        const br = order.BottomRight.GetCoord(c);

        return {
            _id: wall.id,
            c: order.RecreateCoordPair(tl, br)
        }
    })

    canvas.scene.updateEmbeddedEntity("Wall", updates);
}

export function MoveControlledBottomRight(direction) {
    const updates = canvas.walls.controlled.map( (wall) => {
        const c = wall.data.c;
        const order = GetEndpointOrder(wall.data.c);
        const tl = order.TopLeft.GetCoord(c);

        const br = wall.layer._getWallEndpointCoordinates(
            direction.Transform(
                order.BottomRight.GetCoord(c)
            )
        );

        return {
            _id: wall.id,
            c: order.RecreateCoordPair(tl, br)
        }
    })

    canvas.scene.updateEmbeddedEntity("Wall", updates);
}

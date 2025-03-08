import Logger from "./common/logger.mjs"
import Directions from "./directions.mjs";

export const X = 0;
export const Y = 1;

class EndPoint {
    _index;

    constructor(num) {
        this._index = (num - 1) * 2;
    }

    /**
     * Index of the first item in the Endpoint
     */
    get index() {
        return this._index;
    }

    /**
     * Point number
     */
    get num() {
        return (this._index / 2) + 1;
    }

    /**
     * Index of the X position of the coordinate
     */
    get x() {
        return this._index + X;
    }

    /**
     * Index of the Y position of the coordinate
     */
    get y() {
        return this._index + Y;
    }

    /**
     * Extract the endpoint coordinates from a coordinate pair
     */
    getCoord(coordPair) {
        return [ coordPair[this.x], coordPair[this.y] ]
    }
}

/**
 * The first listed endpoint of any coordinate pair
 */
const EP1 = new EndPoint(1);

/**
 * The second listed endpoint of any coordinate pair
 */
const EP2 = new EndPoint(2);

/**
 * @class Ordering
 * Allows accessing coordinates from their TopLeft or BottomRight
 * corners.
 */
class Ordering {
    _topleft;
    _btmright;

    constructor(topleft, btmright) {
        this._topleft = topleft;
        this._btmright = btmright;
    }

    /**
     * @type Endpoint
     * The top left point of the order
     */
    get topLeft() {
        return this._topleft;
    }

    /**
     * @type Endpoint
     * The bottom right point of the order
     */
    get bottomRight() {
        return this._btmright;
    }

    /**
     * Places the coords into their orignal positions
     * @param {Number[2]} tlCoord - The top left coordinates
     * @param {Number[2]} brCoord - The bottom right coordinates
     * @param {Number[4]} coordPair - The coords replaced into their original pair places
     */
    recreateCoordPair(tlCoord, brCoord) {
        let arr = [0, 0, 0, 0];
        arr[this.topLeft.x] = tlCoord[X];
        arr[this.topLeft.y] = tlCoord[Y];
        arr[this.bottomRight.x] = brCoord[X];
        arr[this.bottomRight.y] = brCoord[Y];
        return arr;
    }

    /**
     * Cache of previous orderings.
     * Each entry needs an order and a time element.
     */
    static _cache = new Map();

    /**
     * Find the endpoint ordering for a wall.
     * @param {Wall} wall - Foundry wall object
     * @return Ordering - The ordering of the wall
     */
    static get(wall) {
        const id = wall.id;
        const now = Date.now();

        // Check cache for valid ordering
        if (this._cache.has(id) && (now - this._cache.get(id).time) < 5000) {
            // Entry is still valid, update time and return order
            Logger.log(Logger.MEDIUM, `Found ordering for ${id} in cache.`)
            let entry = this._cache.get(id);
            entry.time = now;
            return entry.order;
        }

        Logger.log(Logger.MEDIUM, `Creating new ordering for ${id}.`)

        // Wall not in cache, find order and update cache
        let order;
        const coordPair = wall.coords;
        // Check Top / Bottom First
        if (coordPair[EP1.y] != coordPair[EP2.y]) {
            // use the higher endpoint
            if (coordPair[EP1.y] < coordPair[EP2.y]) {
                order = new Ordering(EP1, EP2)
            } else {
                order = new Ordering(EP2, EP1);
            }
        } else {
            // Same height, check against left right
            // use the left-most endpoint
            if (coordPair[EP1.x] <= coordPair[EP2.x]) {
                order = new Ordering(EP1, EP2)
            } else {
                order = new Ordering(EP2, EP1);
            }
        }

        this._cache.set(id, {
            time: now,
            order: order
        });

        Logger.log(Logger.MEDIUM, `Created Ordering ${order.topLeft.num} ${order.bottomRight.num} for ${id}`)

        return order;
    }
}

/**
 * Moves both points of the controlled walls in a direction.
 * @param {Direction} direction - The direction in which to move the walls
 */
export function moveControlledWalls(direction) {
    const updates = canvas.walls.controlled.map((wall) => {
        let c = wall.coords;

        let p0 = wall.layer._getWallEndpointCoordinates(
            direction.transform(EP1.getCoord(c))
        );

        let p1 = wall.layer._getWallEndpointCoordinates(
            direction.transform(EP2.getCoord(c))
        );

        return {_id: wall.id, c: p0.concat(p1)};
    });

    Logger.log(Logger.HIGH, `Moving ${updates.length} walls ${direction.name}.`);

    canvas.scene.updateEmbeddedDocuments("Wall", updates);
}

/**
 * Moves the top left points of the controlled walls in a direction.
 * @param {Direction} direction - The direction in which to move the walls
 */
export function moveControlledTopLeft(direction) {
    const updates = canvas.walls.controlled.map( (wall) => {
        const c = wall.coords;
        const order = Ordering.get(wall);

        const tl = wall.layer._getWallEndpointCoordinates(
            direction.transform(
                order.topLeft.getCoord(c)
            )
        );

        const br = order.bottomRight.getCoord(c);

        return {
            _id: wall.id,
            c: order.recreateCoordPair(tl, br)
        }
    })

    Logger.log(Logger.HIGH, `Moving ${updates.length} top left points ${direction.name}.`);

    canvas.scene.updateEmbeddedDocuments("Wall", updates);
}

/**
 * Moves the bottom right points of the controlled walls in a direction.
 * @param {Direction} direction - The direction in which to move the walls
 */
export function moveControlledBottomRight(direction) {
    const updates = canvas.walls.controlled.map( (wall) => {
        const c = wall.coords;
        const order = Ordering.get(wall);

        const tl = order.topLeft.getCoord(c);

        const br = wall.layer._getWallEndpointCoordinates(
            direction.transform(
                order.bottomRight.getCoord(c)
            )
        );

        return {
            _id: wall.id,
            c: order.recreateCoordPair(tl, br)
        }
    })

    Logger.log(Logger.HIGH, `Moving ${updates.length} bottom right points ${direction.name}.`);

    canvas.scene.updateEmbeddedDocuments("Wall", updates);
}

/**
 * Find the center point of a group of walls
 * @param {Wall} walls - The walls to find the center of
 * @returns {number[]} - The center point of the walls
 */
function findCenter(walls) {
    return walls.reduce((acc, wall) => {
        const midpoint = wall.midpoint;
        acc[X] += midpoint[X];
        acc[Y] += midpoint[Y];
        return acc;
    }, [0, 0]).map(c => c / walls.length);
}

/**
 * Flips a point in place across a center point.
 * @param {Number[]} point The origin point
 * @param {Number[]} center The center point
 * @param {Number} coordinate - The x or y coordinate to flip accross
 * @returns {Number[]} The flipped point
 */
function flipPoint(point, center, coordinate) {
    const delta = point[coordinate] - center[coordinate];
    const newPos = point[coordinate] - (2 * delta);
    const newPoint = [...point];
    newPoint[coordinate] = newPos;
    return newPoint;
}

/**
 * Move the endpoints of the selected walls accross the center point
 * in the given direction.
 * @param {Direction} direction - The direction in which to flip the walls
 * @returns {boolean} - True if any walls were flipped, false otherwise
 */
export function flipControlledWalls(direction) {
    const walls = canvas.walls.controlled;
    if (walls.length == 0) {
        return false;
    }
    const component = (direction == Directions.UP || direction == Directions.DOWN) ? Y : X;

    // First, find the center point of the selected walls
    const center = findCenter(walls);

    // Then collect each wall update by adjusting the appropriate coordinate
    const updates = walls.map((wall) => {
        let newCoords = wall.coords;

        let flipped = flipPoint(newCoords.slice(0, 2), center, component);
        newCoords[0] = flipped[0];
        newCoords[1] = flipped[1];
        flipped = flipPoint(newCoords.slice(2, 4), center, component);
        newCoords[2] = flipped[0];
        newCoords[3] = flipped[1];

        return {
            _id: wall.id,
            c: newCoords
        }
    });

    canvas.scene.updateEmbeddedDocuments("Wall", updates);
    return true;
}

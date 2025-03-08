import Logger from "./common/logger.mjs"
import Directions from "./directions.mjs"
import {moveControlledWalls, moveControlledBottomRight, moveControlledTopLeft } from "./walls.mjs"


/**
 * Keybind handler for moving walls. Identify modifiers and move the wall
 * in the appropriate direction.
 * @param {KeyboardEventContext} context - The foundry provided keyboard event
 * @param {Directions} direction - The direction to move the wall
 */
function onMoveWall(context, direction) {
    Logger.log(Logger.LOW, `Keybind event: ${context} ${direction.name}`);
    if (direction) {
        if (context.isShift) {
            // Shift is top left
            moveControlledTopLeft(direction);
        } else if (context.isAlt) {
            // Alt is bottom right
            moveControlledBottomRight(direction);
        } else {
            moveControlledWalls(direction);
        }
    }
}

// Default KeybindingActionConfig options
const COMMON_KEYBIND_OPTIONS = {
    "namespace": "wallter",
    "restricted": true,
    "repeat": true,
};

/**
 * Create a wallter keybind, applying the common wallter options.
 * @param {KeybindingActionConfig} options - The keybind options to register
 */
function registerKeybind(options) {
    const keybindOptions = {...COMMON_KEYBIND_OPTIONS, ...options};
    game.keybindings.register(keybindOptions.namespace, keybindOptions.name, keybindOptions);
}

const moveHint = 
    "Move all selected walls to the DIR.<br/>" +
    "Hold shift to move top (or left) point or hold alt to move bottom (or right) points";


/**
 * Register all keybinds used by the wallter module with foundry.
 */
export default function registerAllKeybinds() {
    Logger.log(Logger.MEDIUM, "Registering keybinds");

    registerKeybind({
        "name": "Move Walls Up",
        "hint": moveHint.replace("DIR", "up"),
        "editable": [{
            "key": "ArrowUp",
        }],
        "onDown": (context) => {
            onMoveWall(context, Directions.UP);
        },
        "reservedModifiers": ["SHIFT", "ALT"],
    });
    registerKeybind({
        "name": "Move Walls Down",
        "hint": moveHint.replace("DIR", "down"),
        "editable": [{
            "key": "ArrowDown",
        }],
        "onDown": (context) => {
            onMoveWall(context, Directions.DOWN);
        },
        "reservedModifiers": ["SHIFT", "ALT"],
    });
    registerKeybind({
        "name": "Move Walls Left",
        "hint": moveHint.replace("DIR", "left"),
        "editable": [{
            "key": "ArrowLeft",
        }],
        "onDown": (context) => {
            onMoveWall(context, Directions.LEFT);
        },
        "reservedModifiers": ["SHIFT", "ALT"],
    });
    registerKeybind({
        "name": "Move Walls Right",
        "hint": moveHint.replace("DIR", "right"),
        "editable": [{
            "key": "ArrowRight",
        }],
        "onDown": (context) => {
            onMoveWall(context, Directions.RIGHT);
        },
        "reservedModifiers": ["SHIFT", "ALT"],
    });
}

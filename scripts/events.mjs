import Logger from "./common/logger.mjs"
import Directions from "./directions.mjs"
import {moveControlledWalls, moveControlledBottomRight, moveControlledTopLeft } from "./walls.mjs"


function controlledWallKeyHandler(event) {
    // Ignore key binds when editing text
    if (event.isComposing || event.keyCode === 229) {
        return;
    }

    const dir = Directions.getDirection(event.code);
    if (dir) {
        if (event.shiftKey) {
            // Shift is top left
            moveControlledTopLeft(dir);
        } else if (event.altKey) {
            // Alt is bottom right
            moveControlledBottomRight(dir);
        } else {
            moveControlledWalls(dir);
        }
    }
}

function onKeyDown(event) {
    Logger.log(Logger.LOW, "A key was pressed!");

    if (canvas.walls.controlled.length) {
        controlledWallKeyHandler(event);
    }
}

export function registerEvents() {
    Logger.log(Logger.MEDIUM, "Registering events");
    document.addEventListener("keydown", onKeyDown)
}

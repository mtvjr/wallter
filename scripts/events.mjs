import Logger from "./common/logger.mjs"
import Directions from "./directions.mjs"
import {MoveControlledWalls, MoveControlledBottomRight, MoveControlledTopLeft} from "./walls.mjs"


function ControlledWallKeyHandler(event) {
    // Ignore key binds when editing text
    if (event.isComposing || event.keyCode === 229) {
        return;
    }

    const dir = Directions.GetDirection(event.keyCode);
    if (dir) {
        if (event.shiftKey) {
            // Shift is top left
            MoveControlledTopLeft(dir);
        } else if (event.altKey) {
            // Alt is bottom right
            MoveControlledBottomRight(dir);
        } else {
            MoveControlledWalls(dir);
        }
    }
}

function OnKeyDown(event) {
    Logger.log(Logger.Low, "A key was pressed!");

    if (canvas.walls.controlled.length) {
        ControlledWallKeyHandler(event);
    }
}

export default function RegisterEvents() {
    Logger.log(Logger.Medium, "Registering events");
    document.addEventListener("keydown", OnKeyDown)
}
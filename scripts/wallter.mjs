import Logger from "./common/logger.mjs"
import {registerEvents} from "./events.mjs"

export const MOD_NAME = "Wallter";
export const MOD_NICK = "wallter";
export const VERSION  = "v0.2.0";

// Target for end users
const RELEASE = {
    threshold: Logger.HIGH,
    name: "Release"
}

// Target for running in foundry as a developer
const DEVEL = {
    threshold: Logger.LOW,
    name: "Devel"
}

export const Target = RELEASE;

function init() {
    Logger.init(MOD_NAME, Target.threshold);

    if (Target == DEVEL) {
        // Enable hook debugging
        CONFIG.debug.hooks = true;
    }

    Logger.log(Logger.HIGH, `${MOD_NAME} ${VERSION} is initialized (${Target.name} target)`);
}

function ready() {
    // We only need to run for GMs, do not activate for players
    if (!game.user.isGM) {
        Logger.log(Logger.HIGH, `${MOD_NAME} is not activated, you are not a GM.`);
        return;
    }

    Logger.log(Logger.HIGH, `${MOD_NAME} is activated.`);
    registerEvents();
}


Hooks.on("init", init);
Hooks.on("ready", ready);

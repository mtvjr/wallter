import Logger from "./common/logger.mjs"
import registerAllKeybinds from "./keybinds.mjs"

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
    registerAllKeybinds();
}


Hooks.on("init", init);

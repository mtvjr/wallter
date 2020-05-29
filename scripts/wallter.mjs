import Logger from "./common/logger.mjs"

export const MOD_NAME = "Wallter";
export const MOD_NICK = "wallter";
export const VERSION = "v0.0.1";

// Target for end users
const RELEASE = {
    threshold: Logger.High,
    name: "Release"
}

// Target for running in foundry as a developer
const DEVEL = {
    threshold: Logger.Low,
    name: "Devel"
}

export const Target = DEVEL;

function init() {
    Logger.init(MOD_NAME, Target.threshold);

    if (Target == DEVEL) {
        // Enable hook debugging
        CONFIG.debug.hooks = true;
    }

    Logger.log(Logger.High, `${MOD_NAME} ${VERSION} is initialized (${Target.name} target)`);
}

function ready() {
    Logger.log(Logger.Low, `${MOD_NAME} is ready`);

}


Hooks.on("init", init);
Hooks.on("ready", ready);

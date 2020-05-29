class LogLevel {
    _name = "";
    _value = 0;

    /**
     * Create a LogLevel object
     * @param {String} name - Description for the log level
     * @param {Number} value - Value used for thresholding. Higher -> More visibility
     */
    constructor(name, value) {
        this._name = name;
        this._value = value;
    }

    /**
     * Get the name of the log level
     */
    get name() {
        return this._name;
    }

    /**
     * Get the value of the log level
     */
    get value() {
        return this._value;
    }
}

export default class Logger {
    /**
     * Displays information of develepment concerns
     */
    static Low = new LogLevel("low", 1);

    /**
     * Displays information for unusual circumstances
     */
    static Medium = {
        value: 2,
        name: "medium"
    }

    /**
     * Displays information for user visible changes
     */
    static High = new LogLevel("high", 3);

    /**
     * Used to display no logging
     */
    static None = new LogLevel("none", Infinity);

    /**
     * Stores the name of the module
     */
    static moduleName = "Unnamed Module";

    /**
     * The current debug threshold
     */
    static threshold = Logger.None;

    /**
     * Initializes the Logger object with a mod name and a log level
     * @param {String} name - The module name, prefixed to all log messages
     * @param {LogLevel} threshold - The minimum level of log messages to display
     */
    static init(name, threshold) {
        Logger.moduleName = name;
        Logger.threshold = threshold;
        
        this.log(threshold, `Set log threshold to ${threshold.name}`);
    }

    /**
     * Print a message to the log
     * @param {LogLevel} level - The log level of the particular message
     * @param {String} message - The message to display
     */
    static log(level, message) {
        if (Logger.threshold.value <= level.value) {
            console.log(this.moduleName + ' | ' + message);
        }
    }
}

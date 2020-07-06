class BaseEditor {
    constructor() {
        this._options = {};
    }

    get formats() {
        throw new Error("Not implemented");
    }

    get isObjectEditor() {
        throw new Error("Not implemented");
    }

    get options() {
        return this._options;
    }

    set options(value) {
        this._options = value;
    }

    open(name) {
        throw new Error("Not implemented");
    }

    load(content) {
        throw new Error("Not implemented");
    }

    /**
     * @param {string} [newFilename] New filename
     */
    save(newFilename) {
        throw new Error("Not implemented");
    }

    configure(key, value) {
        if (value && typeof value === "string") {
            value = value.trim();
        }
        
        this.options[key] = value;
    }

    close() {
        throw new Error("Not implemented");
    }
}

module.exports = BaseEditor;
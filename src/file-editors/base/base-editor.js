class BaseEditor {
    get formats() {
        throw new Error("Not implemented");
    }

    get isObjectEditor() {
        throw new Error("Not implemented");
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

    close() {
        throw new Error("Not implemented");
    }
}

module.exports = BaseEditor;
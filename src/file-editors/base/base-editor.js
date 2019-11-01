class BaseEditor {
    get formats() {
        throw new Error("Not implemented");
    }

    open(name) {
        throw new Error("Not implemented");
    }

    save() {
        throw new Error("Not implemented");
    }

    close() {
        throw new Error("Not implemented");
    }
}

module.exports = BaseEditor;
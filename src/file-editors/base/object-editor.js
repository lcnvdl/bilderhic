const BaseEditor = require("./base-editor");

class ObjectEditor extends BaseEditor {
  constructor() {
    super();
  }

  get isObjectEditor() {
    return true;
  }

  get(selector) {
    throw new Error("get not implemented");
  }

  getFirst(selector) {
    throw new Error("getFirst not implemented");
  }
}

module.exports = ObjectEditor;

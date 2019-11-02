const JsonFileEditor = require("./json.editor");
const XmlFileEditor = require("./xml.editor");
const TxtFileEditor = require("./txt.editor");

class FileEditorsFactory {
    /**
     * @param {string} file Filename
     */
    static getEditor(file) {
        if (file.indexOf(".") === -1) {
            return null;
        }

        const editors = [new JsonFileEditor(), new XmlFileEditor(), new TxtFileEditor()];

        const fileFormat = file.substr(file.lastIndexOf(".") + 1).toLowerCase();

        const editor = editors.find(m => m.formats.some(format => format === fileFormat));

        if (!editor) {
            editor = new TxtFileEditor();
        }

        return editor;
    }
}

module.exports = FileEditorsFactory;
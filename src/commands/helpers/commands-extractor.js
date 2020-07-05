class CommandsExtractor {
    static extract(line) {
        if (!line || line.trim() === "") {
            return [];
        }

        let final = [];

        let current = "";
        let comillas = -1;

        for (let i = 0; i < line.length; i++) {
            const c = line[i];
            if (c === "\"") {
                if (comillas === -1) {
                    comillas = i;
                }
                else if (comillas === i - 1) {
                    current += "\"";
                    comillas = -1;
                }
                else {
                    comillas = -1;
                }
            }
            else if (c === " ") {
                if (comillas === -1) {
                    if (current !== "") {

                        final.push(current);
                        current = "";
                    }
                }
                else {
                    current += " ";
                }
            }
            else {
                current += c;
            }
        }

        if (current !== "") {
            final.push(current);
        }

        return final;
    }
}

module.exports = CommandsExtractor;

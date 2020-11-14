class CommandsExtractor {
  static extract(line) {
    if (!line || line.trim() === "") {
      return [];
    }

    const final = [];

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

  /**
   * @param {string[]} refInstructions Instructions
   */
  static extractBlock(refInstructions) {
    const block = [];

    if (normalize(refInstructions[0]) === ":begin") {
      let counter = 1;
      block.push(refInstructions.shift());

      while (counter > 0 && refInstructions.length > 0) {
        const instruction = refInstructions.shift();
        const normalized = normalize(instruction);
        if (normalized === ":begin") {
          counter++;
        }
        else if (normalized === ":end") {
          counter--;
        }

        block.push(instruction);
      }
    }

    return block;
  }
}

/**
 * @param {string} instruction Instruction
 */
function normalize(instruction) {
  if (instruction) {
    return instruction.trim().toLowerCase();
  }

  return instruction;
}

module.exports = CommandsExtractor;

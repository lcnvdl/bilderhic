class XmlHelper {
    /**
     * @param {string} content Content
     * @param {string[]} [ignoreTags] Ignore tags
     */
    static generateSelfClosingTags(content, ignoreTags) {
        const regexp = /([>](\s*[<][/]\s*((\w|[-])+)\s*[>]))/gi;
        let result;
        let finalContent = content;

        while ((result = regexp.exec(content)) !== null) {
            const all = result[1];
            const tag = result[3];

            if (!ignoreTags.includes(tag)) {
                const index = finalContent.indexOf(all);
                let beginIndex = index;

                while (beginIndex > 0 && finalContent[--beginIndex] != "<");

                let tagName = finalContent.substring(beginIndex + 1, index).trim();

                if (tagName.includes(" ")) {
                    tagName = tagName.substr(0, tagName.indexOf(" "));
                }

                if (all.includes(tagName)) {
                    finalContent = finalContent.replace(all, " />");
                }
            }
        }

        return finalContent;
    }
}

module.exports = XmlHelper;

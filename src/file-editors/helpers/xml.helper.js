class XmlHelper {
    /**
     * @param {string} content Content
     * @param {string[]} [ignoreTags] Ignore tags
     */
    static generateSelfClosingTags(content, ignoreTags) {
        const regexp = /([>](\s*[<][/]\s*(\w|[-])+\s*[>]))/gi;
        let result;
        let finalContent = content;

        while ((result = regexp.exec(content)) !== null) {
            const all = result[1];
            const tag = result[3];
            
            if (!ignoreTags.includes(tag)) {
                finalContent = finalContent.replace(all, "/>");
            }
        }

        return finalContent;
    }
}

module.exports = XmlHelper;

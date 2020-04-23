module.exports = function hashFile(path, contents) {
    contents = path + contents;
    var hash = 5381,
        index = contents.length;

    while (index) {
        hash = (hash * 33) ^ contents.charCodeAt(--index);
    }

    return hash >>> 0;
}

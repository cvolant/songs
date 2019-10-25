/**
 * Scrap out all meteor imports
 * @param {*} source 
 */
module.exports = function loader(source) {
    // remove line containing "meteor/" and line containing "api/".
    return source.replace(/^.*meteor\/.*$/mg, '').replace(/^.*api\/.*$/mg, '')
}
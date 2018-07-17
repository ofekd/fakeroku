/*
    This is a quick hack until LB has support for multiple config files.
    In root dir with no preprocessing for easy removal when LB catches up.

    Removal Instructions:
    - Delete this directory
    - Refactor the import in the entry point (root `index.js`)
    - Reconfigure any use of the options in code
*/

let options = {};

if (process.env.NODE_ENV) {
    const nodeEnv = process.env.NODE_ENV;

    try {
        options = require(`./${nodeEnv}.options.json`);
    } catch (err) {
        if (err.code !== 'MODULE_NOT_FOUND') {
            throw err;
        }
        options = {};
    }
}

module.exports = options;

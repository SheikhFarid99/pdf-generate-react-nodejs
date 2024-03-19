const { join } = require('path');
const os = require('os')

module.exports = {
    cacheDirectory: path.join(os.homedir(), '.cache', 'puppeteer'),
};
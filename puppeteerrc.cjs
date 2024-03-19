const { join } = require('path');
const os = require('os')

module.exports = {
    cacheDirectory: join(os.homedir(), '.cache', 'puppeteer'),
};
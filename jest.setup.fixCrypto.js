// https://github.com/orbitdb/orbit-db/issues/321

const crypto = require('crypto');
Object.defineProperty(global.self, 'crypto', {
    value: {
        getRandomValues: arr => crypto.randomBytes(arr.length),
    },
});
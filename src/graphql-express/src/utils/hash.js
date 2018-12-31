
const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 12;
/**
 * 
 * @param {Sring} str
 * @return {Promise<String>}
 */
const hash = (str) => {
    return bcrypt.hash(str, SALT_ROUNDS);
};

/**
 * 
 * @param {Sring} str
 * @return {String}
 */
const hashSync = (str) => {
    return bcrypt.hashSync(str, SALT_ROUNDS);
};

module.exports = {
    hash,
    hashSync
};
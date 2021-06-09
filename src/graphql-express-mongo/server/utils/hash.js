
const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 12;

/**
 * 
 * @param {String} str
 * @return {Promise<String>}
 */
const hash = (str) => {
    return bcrypt.hash(str, SALT_ROUNDS);
};

/**
 * 
 * @param {String} str
 * @return {String}
 */
const hashSync = (str) => {
    return bcrypt.hashSync(str, SALT_ROUNDS);
};

/**
 * 
 * @param {String} str
 * @param {String} hash
 * @return {Promise<Boolean>}
 */
const compare = (str, hash) => {
    return bcrypt.compare(str, hash);
};

/**
 * 
 * @param {String} str
 * @param {String} hash
 * @return {Boolean}
 */
const compareSync = (str, hash) => {
    return bcrypt.compareSync(str, hash);
};

module.exports = {
    hash,
    hashSync,
    compare,
    compareSync,
};
// 1. HASH - chop && mix

const { createHash } = require('crypto');

/**
 * Hash an input
 * @param {string} input 
 * @return {string}
 */
exports.hash = function (input) {
    // md5 - obsolete
    // sha256 - good
    // argon2 - even better but not built yet into Node crypto
    const hashed = createHash('sha256').update(input);
    // output - common are:
    // 'hex'    -> 7ad123ab)
    // 'base64' -> adsfftiofklfir234k4j54/ lf=
    return hashed.digest('hex');
};


// USAGE:
let password = 'secretpassword';
// store passwordHash and forget for the password
const passwordHash = this.hash(password);
password = undefined;
// check incoming password
const passwordCheck = 'tryguess'; // 'secretpassword'
const passwordCheckHash = this.hash(passwordCheck);
console.log('Matched', passwordHash === passwordCheckHash);

// !!!! Still just storing in DB the 'passwordHash' is not sufficient
// because if hacker have access to the DB he can use rainbow-tables (prehashed passwords),
// an thus find passwords by just finding matches


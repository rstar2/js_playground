// 2. SALT - just random value added before the hash

const { scryptSync, randomBytes, timingSafeEqual } = require('crypto');


/**
 * Hash an input
 * @param {string} input 
 * @return {string}
 */
exports.hash = function (input) {

    const salt = randomBytes(16).toString('hex');

    // recommended keylen is 64,
    // scrypt just provides out of the box computational-expensive operation (as a proof of work)
    const hash = scryptSync(input, salt, 64).toString('hex');
    return `${salt}:${hash}`;
};

exports.verify = function (input, saltedHash) {
    const [salt, hash] = saltedHash.split(':');

    const hashBuffer = scryptSync(input, salt, 64);

    // we could use scryptSync and again compare the strings
    // return hashBuffer.toString('hex') === hash;

    // but it's better to use timingSafeEqual to prevent 'timing attacks',
    // it give random times for verifying
    // so gives less info to a hacker - it's used in SSH protocol

    return timingSafeEqual(hashBuffer, Buffer.from(hash, 'hex'));
};


// USAGE:

const usersDB = new Map();
/**
 * 
 * @param {string} email 
 * @param {string} password 
 * @return {object}
 */
function signup(email, password) {
    const passwordSaltedHash = this.hash(password);

    // user to store in DB of instance
    const user = {
        email,
        password: passwordSaltedHash
    };

    usersDB.set(email, user);

    return user;
}

/**
 * 
 * @param {string} email 
 * @param {string} password 
 * @return {object|undefined}
 */
function login(email, password) {
    const user = usersDB.get(email);
    if (!user)
        return undefined;

    return this.verify(password, user.password) ? user : undefined;
}

const email = 'tester@test.test';
signup(email, 'secretpassword');
console.log('Signed up new user', email);

let user = login('tester@test.test', 'tryguess');
console.log(`Logging in ${email} : ${user ? 'succeeded' : 'failed'}`);

user = login(email, 'secretpassword');
console.log(`Logging in ${email} : ${user ? 'succeeded' : 'failed'}`);



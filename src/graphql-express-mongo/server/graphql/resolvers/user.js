const { promisify } = require('util');

const jwt = require('jsonwebtoken');

const { hash: hashPass, compare: comparePass } = require('../../utils/hash');
const { fixMongoUser } = require('./helpers');
const { User } = require('../../db/models');

const secret = process.env.JWT_SECRET;

const jwtSign = promisify(jwt.sign);

/**
 * 
 * @param {User} user
 * @return {Promise<String>}
 */
const generateToken = async (user) => {
    // add the userId and email in the JWT
    const token = await jwtSign({ id: user._id, email: user.email }, secret, {
        expiresIn: '24h'
    });

    return token;
};

module.exports = {
    // For demo purposes different ways of passing arguments are used (args.input or explicit args)
    // and different JS techniques (await/async - promises - callbacks)

    /**
     * @param {Object} args
     * @return {Promise<User>} 
     */
    createUser(args) {
        const { email, password } = args.input;

        // check if email is taken first
        return User.findOne({ email })
            .then(user => {
                if (user) throw new Error('User exists');

                // no such user - so continue with first hashing the password
                return hashPass(password);
            })
            .then(password => new User({ email, password }))
            .then(user => user.save())
            .then(fixMongoUser);
    },

    /**
     * @param {Strin} email 
     * @param {Strin} password
     * @return {Promise<AuthData>} 
     */
    async loginUser({ email, password }) {
        let user = await User.findOne({ email });
        if (!user) throw new Error('User doesn\'t exist');

        const isValid = await comparePass(password, user.password);
        if (!isValid) throw new Error('User password doesn\'t match');

        user = await fixMongoUser(user);

        const jwt = await generateToken(user);
        return {
            userId: user._id,
            jwt,
        };
    },

    /**
     * @param {Strin} email 
     * @param {Strin} password
     *  @return {Promise<AuthData>}  
     */
    async registerUser({ email, password }) {
        const user = await this.createUser({ input: { email, password } });

        const jwt = await generateToken(user);
        return {
            userId: user._id,
            jwt,
        };
    },

};
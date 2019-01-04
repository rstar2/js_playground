const jwt = require('jsonwebtoken');

const { hash: hashPass, compare: comparePass } = require('../../utils/hash');
const { fixMongoUser } = require('./helpers');
const { User } = require('../../db/models');

const secret = process.env.JWT_SECRET;

module.exports = {
    /**
     * @param {Object} args 
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
     */
    async loginUser({ email, password }) {
        const user = await User.findOne({ email });
        if (!user) throw new Error('User doesn\'t exist');

        const isValid = await comparePass(password, user.password);
        if (!isValid) throw new Error('User password doesn\'t match');

        // add the userId and email in the JWT
        const token = jwt.sign({ id: user.id, email: user.email }, secret, {
            expiresIn: '24h'
        });

        return {
            userId: user.id,
            jwt: token,
        };
    },

};
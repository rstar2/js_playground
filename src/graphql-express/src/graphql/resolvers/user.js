const { hash } = require('../../utils/hash');
const { fixMongoUser } = require('./helpers');
const { User } = require('../../db/models');


module.exports = {
    createUser(args) {
        const { email, password } = args.input;

        // check if email is taken first
        return User.findOne({ email })
            .then(user => {
                if (user) throw new Error('User exists');

                // no such user - so continue with first hashing the password
                return hash(password);
            })
            .then(password => new User({ email, password }))
            .then(user => user.save())
            .then(fixMongoUser);
    },
};
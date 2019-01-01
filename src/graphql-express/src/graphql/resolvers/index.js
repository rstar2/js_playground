
const eventResolvers = require('./event');
const userResolvers = require('./user');
const bookingResolvers = require('./booking');


const rootResolvers = {
    // just a simple demo
    items() {
        return ['Test1', 'Test2', 'Test3'];
    },
    createItem(args) {
        return args.name;
    },

    // real resolvers
    ...eventResolvers,
    ...userResolvers,
    ...bookingResolvers,
};

module.exports = rootResolvers;
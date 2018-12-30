const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');

const Event = require('../db/models/event');

// const { queryType } = require('./query.js');
// const schema = new GraphQLSchema({ query: queryType });

module.exports = graphqlHTTP({
    // the ! after a type means that the argument/parameter/return-type is not-nullable, can never be/returned as 'null'
    schema: buildSchema(`
        type Event {
            # name it '_id' because Mongo (and Mongoose) use also '_id' property to store IDs too
            _id: ID!        # ID is also a special GraphQL type
            title: String!
            description: String!
            price: Float!
            date: String!   # Date type doesn't exist
        }

        # a special "type" that can be used in mutations in order not to repeat all the needed arguments
        # the convention is to create as the real type with the 'Input' suffix
        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        type rootQuery {
            # a demo
            items: [String!]!

            # a list of out custom Event type
            events: [Event!]!
        }

        type rootMutation {
            # a demo
            createItem(name: String!): String!

            createEvent(eventInput: EventInput!): Event!
        }

        schema {
            query: rootQuery
            mutation: rootMutation
        }
    `),

    // root resolvers
    rootValue: {
        // just a simple demo
        items() {
            return ['Test1', 'Test2', 'Test3'];
        },
        createItem(args) {
            return args.name;
        },

        // real resolvers

        // return a Promise
        events() {
            return Event.find().exec()
                .then(arr => arr.map(getMongoObj));
        },
        // return a Promise
        createEvent(args) {
            const eventInput = args.eventInput;
            const event = new Event({
                title: eventInput.title,
                description: eventInput.description,
                price: +eventInput.price,
                date: new Date(eventInput.date)
            });

            return event.save()
                .then(getMongoObj);
        },
    },
    graphiql: true,
});

const getMongoObj = (obj) => {
    // the Mongoose found/saved object has metadata attached so just get the document
    // convert the Mongo ObjectID type to plain String so GraphQL can return it
    return { ...obj._doc, _id: obj._doc._id.toString() };
};

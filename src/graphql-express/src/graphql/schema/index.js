const { buildSchema } = require('graphql');

// Notes:
// 1. the ! after a type means that the argument/parameter/return-type is not-nullable, can never be/returned as 'null'
// 2. comments are starting with #
// 3. There's special GraphQL type called ID
// 4. There's no Date type
module.exports = buildSchema(`
        type Event {
            # name it '_id' because Mongo (and Mongoose) use also '_id' property to store IDs too
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!   
            creator: User!
        }

        # a special "type" that can be used in mutations in order not to repeat all the needed arguments
        # the convention is to create as the real type with the 'Input' suffix
        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
            creator: String!
        }

        type User {
            _id: ID!
            email: String!
            password: String # it can be nullable - we we never return it
            events: [Event!]
        }

        input UserInput {
            email: String!
            password: String! # when we create a user the password is required
        }

        type Booking {
            _id: ID!
            event: Event!
            user: User!
            createdAt: String!
            updatedAt: String!
        }

        type rootQuery {
            # a demo
            items: [String!]!

            # a list of out custom types
            events: [Event!]!
            bookings: [Booking!]!
        }

        type rootMutation {
            # a demo
            createItem(name: String!): String!


            createEvent(input: EventInput!): Event!
            createUser(input: UserInput!): User!
            createBooking(eventId: ID!, userId: ID!): Booking!
            cancelBooking(bookingId: ID!): Event!
        }

        schema {
            query: rootQuery
            mutation: rootMutation
        }
    `);
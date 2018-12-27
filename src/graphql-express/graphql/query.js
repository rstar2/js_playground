const _ = require('lodash');
const { GraphQLObjectType, GraphQLString, GraphQLInt } = require('graphql');

const { movieType, directorType } = require('./types.js');
const { movies, directors } = require('./data.js');


//Define the Query
const queryType = new GraphQLObjectType({
    name: 'Query',
    fields: {
        /*
        Can be queried with :
        query {
            hello
        }
        */
        hello: {
            type: GraphQLString,

            resolve: function () {
                return 'Hello World';
            }
        },

        /*
        Can be queried with :
        query {
            movie(id: 1) {
                name
            }
        }
        */
        movie: {
            type: movieType,
            args: {
                id: { type: GraphQLInt }
            },
            resolve: function (source, args) {
                return _.find(movies, { id: args.id });
            }
        },

        /*
        Can be queried with :
        query {
            director(id: 1) {
                id
                movies {
                    name
                    year
                }
            }
        }
        */
        director: {
            type: directorType,
            args: {
                id: { type: GraphQLInt }
            },
            resolve: function (source, args) {
                return _.find(directors, { id: args.id });
            }
        }
    }
});

exports.queryType = queryType;
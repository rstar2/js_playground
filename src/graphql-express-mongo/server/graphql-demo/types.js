const _ = require('lodash');
const { GraphQLObjectType, GraphQLID,
    GraphQLString, GraphQLInt, GraphQLList } = require('graphql');

const { movies } = require('./data.js');

// Define Movie Type
const movieType = new GraphQLObjectType({
    name: 'Movie',
    fields: {
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        year: { type: GraphQLInt },
        directorId: { type: GraphQLID }
    }
});

//Define Director Type
const directorType = new GraphQLObjectType({
    name: 'Director',
    fields: {
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        

        // When the director endpoint is called we have to return the director details,
        // as well as all the movies the director has directed.
        // so 'movies' will contain the list of movies by this director.
        movies: {
            type: new GraphQLList(movieType),
            resolve(source, args) {
                return _.filter(movies, { directorId: source.id });
            }
        }
    }
});

module.exports = {
    movieType,
    directorType,
};
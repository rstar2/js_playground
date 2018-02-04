// import { struct } from 'superstruct';
const struct = require('superstruct').struct;

const Person = struct({
    name: 'string',
    age: 'number',
    married: 'boolean?', // optional
});

module.exports = Person;

// Usage : 
// const data = {
//     name: 'Rumen Neshev',
//     age: 40
// };

// // this should validate and pass
// const rumen = Person(data);
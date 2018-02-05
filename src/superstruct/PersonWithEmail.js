const superstruct = require('superstruct').superstruct;

const structCustom = superstruct({
    types: {
        email: (value) => value.indexOf('@@') !== -1
    }
});

const PersonWithEmail = structCustom({
    name: 'string',
    age: 'number',

    email: 'email'       // custom type
});

module.exports = PersonWithEmail;

// Usage:
// const data = {
//     name: 'Rumen Neshev',
//     age: 40
// };

// these should not validate
// PersonWithEmail(data);
// PersonWithEmail({ ...data, email: 123 });
// PersonWithEmail({ ...data, email: '123' });

// this should validate and pass
// const rumen = PersonWithEmail({ ...data, email: 'rstar2@abv.bg' });
const mongoose = require('mongoose');

// load all models
require('require-all')({
    dirname: __dirname + '/models',
    filter: /^(.+)\.js$/
});

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
})
    .then(() => console.log('Mongoose connected to MongoDB'))
    .catch(error => console.error('Mongoose failed to connect to MongoDB', error));

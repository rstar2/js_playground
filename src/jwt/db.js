const path = require('path');

const glob = require('glob');
const mongoose = require('mongoose');

mongoose.connect(`mongodb://${process.env.MONGO_DB}`,
    { useNewUrlParser: true });

const modelsFolder = path.resolve(__dirname, 'models');
const files = glob.sync('**/*.js', { cwd:  modelsFolder});
files.forEach(file => require(path.join(modelsFolder, file)));
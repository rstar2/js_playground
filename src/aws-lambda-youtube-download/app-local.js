// Run the Express serer locally on port 3000

const stage = process.env.NODE_ENV || 'dev';
const app = require('./app')(stage);

app.listen(3000);

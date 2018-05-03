const path = require('path');
const express = require('express');

const app = express();

const root = path.join(__dirname, 'public');

// 1.  https://github.com/papandreou/express-processimage
// <img src="/public/image/50blue.jpg?resize=400,300" />
// app.use('/public', require('express-processimage')({ root }));
// app.use('/public', express.static(root));
// Result : // does not stores the converted filed


// 2. https://github.com/zivester/node-quickthumb
// <img src="/public/images/50blue.jpg?dim=200x100" />
app.use('/public', require('quickthumb').static(root));
app.use('/public', express.static(root));

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log('Test app is listening on http://localhost:' + port);
});

const sendmail = require('sendmail')();

sendmail({
    from: 'no-reply@neshev.com',
    // to: 'rumenn@qnext.com',
    to: 'rstar@abv.bg', // not working
    // to: 'rstar2@abv.bg, test@sohu.com, test@163.com',
    subject: 'test sendmail',
    html: 'Mail of test sendmail ',
}, function(err, reply) {
    console.log(err && err.stack);
    console.dir(reply);
});
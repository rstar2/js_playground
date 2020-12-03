let level = require('level');
const sublevel = require('sublevel');

// create a sublevel by passing a level `db` instance
let db = level('/tmp/level');
let items = sublevel(db, 'items');

items.put('foo', 'bar', function (err) {
    items.get('foo', function (err, data) {
        console.log(data); // => 'bar'
    });
});

// create deeper sublevels by passing the parent
let posts = sublevel(items, 'posts');

// or alternatively by calling `.sublevel()`
let comments = posts.sublevel('comments');
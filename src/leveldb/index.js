const level = require('level');

// 1) Create our database, supply location and options.
//    This will create or open the underlying LevelDB store.
const db = level('./mydb');

// 2) Put a key & value
db.put('name', 'Level', function (err) {
    if (err) return console.log('Ooops!', err) // some kind of I/O error

    // 3) Fetch by key
    db.get('name', function (err, value) {
        if (err) return console.log('Ooops!', err) // likely the key was not found

        // Ta da!
        console.log('name=' + value)
    })
})
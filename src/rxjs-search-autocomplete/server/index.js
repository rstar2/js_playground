// server.js
const path = require('path');
const _ = require('lodash');
const jsonServer = require('json-server');

// Express Application
const server = jsonServer.create();

// get and use the default middlewares
const defMmiddlewares = jsonServer.defaults({
    static: path.join(__dirname, '../client'),
});

server.use(defMmiddlewares);

// add-custom ones
server.use(require('./middlewares/1'));




// add rewriting routes - should be added before server.use(router)
server.use(jsonServer.rewriter({
    '/api/*': '/$1',
    '/blog/:resource/:id/show': '/:resource/:id',
    '/articles\\?id=:id': '/posts/:id',
}));

// Express Router
const router = jsonServer.router(path.join(__dirname, 'data/db.json'));


server.use((req, res, next) => {
    // remember the original query params as later 'req.query' is stripped
    // from all query params not found in the db.json.
    // But I need the '_pick' query param for instance
    req._query = { ...req.query };
    next();
});
// customize the output
router.render = (req, res) => {
    // use the original query params 
    if (req._query['_pick']) {
        // _.property(['a', 'b']))
        let pickedData = _.map(res.locals.data, req._query['_pick']);

        // _.pick(object, [paths])
        //_.get(object, 'a[0].b.c');
        res.jsonp(pickedData);
    } else {
        // this is the default
        res.jsonp(res.locals.data);
    }
};

server.use(router);

server.listen(3000, () => {
    console.log('JSON Server is running');
});

/*
Note - Relations (foreign keys)
{
    "posts": [
        {
            "id": 1,
            "title": "json-server",
            "authorId": 1
        },
        {
            "id": 2,
            "title": "cooking",
            "authorId": 2
        },
        {
            "id": 3,
            "title": "js",
            "authorId": 1
        }
    ],
    "authors": [
        {
            "id": 1,
            "name": "Rumen"
        },
        {
            "id": 2,
            "name": "Kasia"
        }
    ],
    "comments": [
        {
            "id": 1,
            "body": "some comment",
            "postId": 1
        }
    ]
}

This will allow request like:
/comments?_expand=post
/posts?_expand=author

and cross-referenced:
/posts?_embed=comments
/authors?_embed=posts


Note - Full-text search - Use 'q' query
GET /posts?q=js


Note - for plain array data:
{
    "words": ["a", "aa", "abv"]
}
/words?_start=0&_end=1
/words?q=v
/words?_limit=3
*/
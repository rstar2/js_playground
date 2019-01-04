# Test the app from the Graphi GUI 

Open the app on in a browser on "serverEndpoint/graphql"
  
# Test the app explicitly

1. With culr

```sh
curl -X POST \
-H "Content-Type: application/json" \
-d '{"query": "{ hello }"}' \
http://localhost:5000/graphql
```

The result should be:

```json
{"data":{"hello":"Hello world!"}}
```

2. With browser's Fetch API

```js
fetch('/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  body: JSON.stringify({query: "{ hello }"})
})
  .then(r => r.json())
  .then(data => console.log('data returned:', data));
```



# Run a more realtime application with MongoDB database

1. Run Mongo in Docker

```sh
$ docker-compose -f ./db/docker-compose.yml up
```


https://www.smashingmagazine.com/2018/12/real-time-app-graphql-subscriptions-postgres/

# Technology used

## For the server

1. The GraphQL Engine - Harusa server (A ready-to-use GraphQL server on Postgres)
2. Postgres server

For local development both will be in Docker containers
But for production recommended is on Heroku for instance

## For the client
1. Apollo Client (For easily integrating clients apps with a GraphQL server)

# Implementation

1. Run a Postgres as Docker container

 - start the real server container
```
$ docker run -d --name graphql-realtime-db -e POSTGRES_PASSWORD=mysecretpassword postgres
```

 - connect from inside the same Postgres server:
```
$ docker exec -it -u postgres graphql-realtime-db psql
```

 - connect from a different container. Note this container should have 'psql' installed so it could be also from the a 'postgres' image. Here ```psql -h postgres -U postgres``` is the container's cmd where -h/--hostname (default: localhost), -p/--port (default: "5432"), -U/--username (default: "root")
```
$ docker run -it --rm --link graphql-realtime-db:postgres postgres psql -h postgres -U postgres
```


2. Run Hasura GraphQL Engine that will connect to the Postgres server

```
$ docker run -d -p 8080:8080 --link graphql-realtime-db:postgres \
       -e HASURA_GRAPHQL_DATABASE_URL=postgres://postgres:mysecretpassword@postgres:5432/postgres \
       -e HASURA_GRAPHQL_ENABLE_CONSOLE=true \
       hasura/graphql-engine:v1.0.0-alpha32
```
where  ```HASURA_GRAPHQL_DATABASE_URL=postgres://username:password@hostname:port/dbname```

  - check it on http://localhost:8080/console (for Windows the docker-machine IP like http://192.168.99.100:8080/console)

3. Could use docker-compose inside the 'graphql' subfolder


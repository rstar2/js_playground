https://www.smashingmagazine.com/2018/12/real-time-app-graphql-subscriptions-postgres/

# Technology used

## For the server

1. The GraphQL Engine - Hasura server (A ready-to-use GraphQL server on Postgres)
2. Postgres server

For local development both will be in Docker containers
But for production recommended is on Heroku for instance

## For the client

1. Apollo Client (For easily integrating clients apps with a GraphQL server)

 ----------
 ----------
 ----------

# Implementation

1. Run a Postgres as Docker container

- start the real server container

```sh
$ docker run -d --name graphql-realtime-db -e POSTGRES_PASSWORD=mysecretpassword postgres:11.1
```

- connect from inside the same Postgres server:

```sh
$ docker exec -it -u postgres graphql-realtime-db psql
```

- connect from a different container. Note this container should have 'psql' installed so it could be also from the a 'postgres' image. Here ```psql -h postgres -U postgres``` is the container's cmd where -h/--hostname (default: localhost), -p/--port (default: "5432"), -U/--username (default: "root")

```sh
$ docker run -it --rm --link graphql-realtime-db:postgres postgres psql -h postgres -U postgres
```

2. Run Hasura GraphQL Engine that will connect to the Postgres server

```sh
$ docker run -d -p 8080:8080 --link graphql-realtime-db:postgres \
       -e HASURA_GRAPHQL_DATABASE_URL=postgres://postgres:mysecretpassword@postgres:5432/postgres \
       -e HASURA_GRAPHQL_ENABLE_CONSOLE=true \
       hasura/graphql-engine:v1.0.0-alpha32
```

where  ```HASURA_GRAPHQL_DATABASE_URL=postgres://username:password@hostname:port/dbname```

- check it on http://localhost:8080/console (for Windows the docker-machine IP like http://192.168.99.100:8080/console)

3. Could use docker-compose inside the 'hasura' folder


# Initialize the Hasura GraphQL Engine

1. Ensure Hasura CLI is installed
2. Ensure the Hasura GraphQL Engine server is running (like in a Docker container). Lets say on http://localhost:8080)
3. Create a Hasura project somewhere (e.g. a folder with config.yaml file inside) and add in config.yaml the Hasura GraphQL Engine endpoint URL
  - let Hasura CLI do

  ```sh
  $ hasura init --directory hasura --endpoint http://localhost:8080
  ```

  so in config.yaml should be
  ```yaml
  endpoint: http://localhost:8080
  ```

  - create Hasura migrations pair - from inside the Hasura project folder

  ```sh
  $ hasura migrate create init_db
  ```
  This will create a pair of up/down and sql/yaml files. Write the ProgreSLQ scripts and the Hasura schemas

  And also data:
  
  ```sh
  $ hasura migrate create init_data
  ```

  - apply the migrations

  ```sh
  $ hasura migrate apply
  ```


Inspired by https://www.smashingmagazine.com/2018/12/real-time-app-graphql-subscriptions-postgres/  
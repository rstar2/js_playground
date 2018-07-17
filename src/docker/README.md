1. Using a Dockerfile in your Node.js app project :

```
# specify the node base image with your desired version node:<version>
FROM node:6
# replace this with your application's default port
EXPOSE 8888
```

Then build the Docker image and run/create a container from it:

Usage:  docker build [OPTIONS] PATH | URL
-t      - "Name and optionally a tag in the 'name:tag' format"

```
$ sudo docker -t my-nodejs-app-image .
```

Usage:  docker run [OPTIONS] IMAGE [COMMAND] [ARG...]
-i      - "Keep STDIN open even if not attached"
-t      - "Allocate a pseudo-TTY"
--rm    - "Automatically remove the container when it exits"
--name  - "Assign a name to the container"
```
$ PORT=8080 && sudo docker run -it --rm -p $PORT:$PORT --name my-nodejs-app-container my-nodejs-app-image
```

2. Using Docker Compose :

Docker Compose copies your current directory (including node_modules) to the container. It assumes that your application has a file named package.json defining start script.

```
version: "2"
services:
  node:
    image: "node:8"
    user: "node"
    working_dir: /home/node/app
    environment:
      - NODE_ENV=production
    volumes:
      - ./:/home/node/app
    expose:
      - "8081"
    command: "npm start"
```

Then :

```
$ docker-compose up -d
```


3. Running a single Node.js script :

```
$ docker run -it --rm --name my-running-script -v "$PWD":/usr/src/app -w /usr/src/app node:8 node your-daemon-or-script.js
```
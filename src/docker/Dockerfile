# base image with specified node version (node:<version>)
FROM node:10

# The ARG instruction defines a variable that users can pass at build-time
# to the builder with the docker build command using the --build-arg <varname>=<value> flag.
# Default value can be set also if none argument is passed
ARG PORT=5000

# Note that each instruction is run independently,
# and causes a new image to be created - so RUN cd /tmp will not have any effect on the next instructions.

# set environment variables
ENV NPM_CONFIG_LOGLEVEL=info
ENV NODE_ENV=production
# access the ARG variable PORT and set/elevate it as an env variable
ENV PORT $PORT

# application's default port
# only these ports the Docker container is listening to, only they are exposed
RUN echo 'HTTP server will listen by default on' $PORT

# Make port available to the world outside this container
EXPOSE $PORT

WORKDIR /app

# note - COPY will ignore files from the .dockerignore files , like node_modules
# if no .dockerignore is present then:
# COPY package.json /app 
# RUN npm install
# COPY . /app

COPY . /app
RUN npm install

# only one CMD instuction can be in a Dockerfile
CMD npm start


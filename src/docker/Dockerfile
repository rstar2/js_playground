# The ARG instruction defines a variable that users can pass at build-time
# to the builder with the docker build command using the --build-arg <varname>=<value> flag.
# Default value can be set also if none argument is passed
ARG PORT=8080

# base image with specified node version (node:<version>)
FROM node:10

# Note that each instruction is run independently,
# and causes a new image to be created - so RUN cd /tmp will not have any effect on the next instructions.

# set environment variables
ENV NPM_CONFIG_LOGLEVEL info
ENV NODE_ENV=production
# access the ARG variable PORT and set it as an env variable
ENV PORT $PORT

WORKDIR /app

COPY . /app
RUN npm install

# only one CMD instuction can be in a Dockerfile
CMD npm start


# application's default port
# only these ports the Docker container is listening to, only they are exposed
EXPOSE $PORT
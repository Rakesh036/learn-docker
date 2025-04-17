FROM node:23.11.0-alpine3.21

WORKDIR /home/app/

# copy source code to docker image
COPY package*.json . 
# the above line copy both package and package-lock file and as we declare working dir so it copy in current
# location with same name


# NOTE: as docker use caching during build image so always copy static file first and changable file later on because when that file change then all layer below that line will rebuild, so to reduce build size, follow this

EXPOSE 3000

RUN npm install
COPY index.js .
CMD [ "npm","start" ]

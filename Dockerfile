FROM node:12.2.0-alpine
WORKDIR '/var/www/app'

RUN npm install -g nodemon
RUN npm install -g sequelize-cli

FROM node:9-alpine

RUN mkdir /app

# To make sure we have the same time
ENV TZ=Europe/Berlin
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Make sure some dependencies are there
RUN apk update
RUN apk add python make gcc g++
RUN rm -Rf /var/cache/apk

# Lets install webpack globally
RUN npm install webpack -g

WORKDIR /app
COPY . /app
RUN npm install

EXPOSE 3000

CMD npm run start
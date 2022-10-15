FROM node:16.13.0

WORKDIR /usr/agrotech

COPY package.json /usr/agrotech
COPY yarn.lock /usr/agrotech


RUN yarn install

COPY . /usr/agrotech

EXPOSE 8080

# Chalk Coloring
ENV FORCE_COLOR 1

CMD ["yarn", "docker:dev"]

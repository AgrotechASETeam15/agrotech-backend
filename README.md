# Agrotech Backend

The code that powers AgroTech.

## How to Install for Developers

1. Please have Docker installed on your operating system.
2. `yarn install`.
3. `docker-compose up --build` to run the development server.

## Commands

- `docker-compose up --build` - builds the docker environment & loads up a development server.
- `docker-compose up` - uses your existing images and spins up the dev server.
- `docker-compose down` - closes the docker development environment & removes the build.
- `yarn build` - builds the server from typescript for production.
- `yarn start` - runs the production build.
- `yarn lint` - lints the code and shows you what type of ESLint errors there are.
- `yarn lintfix` - ESLint fixes the lint errors.

## Developer Tools

If you're using a GUI (like [HeidiSQL](https://www.heidisql.com/) on Windows/[Sequel Ace](https://github.com/Sequel-Ace/Sequel-Ace) on MacOS) to access the Docker MariaDB Database. Below are the credentials you'll need to see the data that's being entered in the development database.

- Spin up the dev environment with `docker-compose up`

```md
Host: `0.0.0.0`
User: `root`
Password: `password`
Port: `8081`
```

If you're installing new dependencies, you'll need to rebuild the docker images. Run `docker-compose up --build` to build a fresh build.

## Files needed to run in Production

`.env` file needs to be created that will take the following parameters.

```
SERVER_HOST - web/local address where the server is located.
SERVER_PORT - port of the SERVER_HOST.
DB_HOST - web/local address of where MariaDB is located.
DB_USER - username on the MariaDB server.
DB_PASSWORD - Password to access MariaDB.
DB_NAME - Database Name.
ORIGINS - CORS Related Websites, takes a string or an array of strings.
```

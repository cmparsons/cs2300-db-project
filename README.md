# cs2300-project

Databases project for CS2300 at Missouri S&T. The app is a basic social network site where users can make connect with other users by makeing relavent posts in communities and commenting on posts. Users also can direct message other users.

The application was built using a React frontend and an Express + MySQL backend.

## Contributors

* Christian Parsons
* Lucas Belshoff
* Ketul Patel

# Getting Started

## Requirements

* A newer version of [Node](https://nodejs.org/en/) (LTS recommeneded)
* [Git](https://git-scm.com/)
* [MySQL](https://www.mysql.com/)

Enter the following commands in the terminal (preferrably in the directory you want to save the project):

```
git clone https://github.com/cmparsons/cs2300-project.git
cd cs2300-project
npm run setup
npm run dev
```

Site will be running on [localhost:3000](localhost:3000)

## What is happening?

1.  Cloning the respository and getting all the code for the project.
2.  Installing all the required dependencies needed for the project.
3.  Starting the server and client.

## Setup database settings

`server/knexfile.js` contains the settings used to start up the MySQL instance. The database will use the settings set up by environment variables (`process.env`). Either setup a `.env` file
in the root directory of `server` with each variable assigned or set a default argument, i.e.,

```
database: process.env.DB_NAME || 'test'
```

where `test` is the default DB name.

```
connection: {
  database: process.env.DB_NAME || 'test',
  port: process.env.DB_PORT || 3306,
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
}
```

## Run Migrations

Make sure you have a MySQL server running and a database called `test` (you can change the database name in `server/knexfile.js`)

Run the following commands:

```
cd server
npm run knex migrate:latest
```

This will run all the migrations in `server/src/db/migrations` which should create all necessary tables.

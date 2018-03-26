# cs2300-project

Databases project for CS2300 at Missouri S&T.

# Getting Started

## Requirements

* A newer version of [Node](https://nodejs.org/en/)	(LTS recommeneded)
* [Git](https://git-scm.com/)
* (Optional but recommended) [VSCode](https://code.visualstudio.com/)


Enter the following commands in the terminal (preferrably in the directory you want to save the project):

```
git clone https://github.com/cmparsons/cs2300-project.git
cd cs2300-project
npm run setup
npm run dev
```

Site will be running on [localhost:3000](localhost:3000)

## What is happening?

1. Cloning the respository and getting all the code for the project.
2. Installing all the required dependencies needed for the project.
3. Starting the server and client.

## Run Migrations

Make sure you have a MySQL server running and a database called `test_db` (you can change the database name in `server/knexfile.js`)

Run the following commands:

```
cd server
npm knex migrate:latest
```

This will run all the migrations in `server/src/db/migrations` which should create all necessary tables.

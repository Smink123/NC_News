# Hello! Welcome to NC News

## About NC News

NC_News is a backend project developed as part of the Northcoders bootcamp. This API serves as the foundation for a news site, offering data on news articles, users, comments, and trending topics. It facilitates the communication between the backend and frontend, allowing front-end developers to access, visualise, and interact with the provided data.

### Key features of NC News:
- Retrieve information on news articles, users, comments, and trending topics through various GET endpoints.
- Interact dynamically with the API using POST, PATCH, and DELETE methods, enabling efficient data manipulation and updates.

## The hosted version of NC News:
Please see the endpoints object in the link for NC News’s available endpoints and their descriptions. Feel free to explore each one!
[https://nc-news-sarah.onrender.com/api](https://nc-news-sarah.onrender.com/api)

## Required .env. files:
To work with this repository locally, follow these steps to set up the necessary environment variables for connecting to the databases. Ensure that you have the following files saved at the root level:

- **.env.development**: (in this file please include the development environment configurations here. You will find the database name in the setup.sql file. e.g. PGDATABASE='insert development database name here')
- **.env.test**: (in this file please include the test environment configuration here. You will find the database name in the setup.sql file. e.g. PGDATABASE='insert test database name here')

Once the files have been created, please add them to your .gitignore file to ensure the contents (environment variables) are not pushed to Github

## How to set-up the NC_News application locally:
1. Fork and clone the following repo: [https://github.com/Smink123/NC_News](https://github.com/Smink123/NC_News)
2. Run `npm install` to install all dependencies onto your local computer required for this application
3. Run `npm setup-dbs` to drop and create the databases
4. Run `npm seed` to seed the databases with the initial data
5. Run `npm test app` to run all of the integration tests for the application. Each describe block in the app.test.js file is compiled of tests for different HTTP methods for each endpoint.

## Required packages:
Please ensure you have these minimum versions of Node.js and PostgreSQL to efficiently view and run the API:
- Postgres (minimum version): 8.7.3
- Node.js (minimum version): v18.17.1

Thank you for your time and for following these steps! Any thoughts or questions? Please feel free to reach out.


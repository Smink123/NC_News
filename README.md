To work with this repository locally, follow these steps to set up the necessary environment variables for connecting to the databases. Ensure that you have the following files saved at the root level:



.env.development (in this file please include the development environment configurations here. You will find the database name in the setup.sql file. e.g. PGDATABASE='insert development database name here')

.env.test (in this file please include the test environment configuration here. You will find the database name in the setup.sql file. e.g. PGDATABASE='insert test database name here')



Once the files have been created, please add them to your .gitignore file to ensure the contents (environment variables) are not pushed to Github

Thank you for following these steps!

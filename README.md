## Install
* $ git clone ...
* $ npm install
* $ npm install -g sequelize-cli # to run migrations
* edit config/config.json to point to a MySQL DB
* $ sequelize db:migrate # to set up tables in DB
* $ node index.js # runs server
* browse to http://localhost:3000 in browser

## Purpose
Collect survey questions. Allow anonymous users to respond. Prevent collecting duplicate responses from anonymous users. (There are a thousand ways around this-- it'll prevent casual abuse but not malicious). Allow creating new questions, and viewing stats.

But this is also a quick project and doesn't allow editing questions, more than 4 responses (strictly a UI limitation) or deleting questions.
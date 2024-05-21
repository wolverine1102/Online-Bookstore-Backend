const mongoose = require('mongoose');
const dotenv = require('dotenv');
const seedAdmin = require('../seed/seedAdmin');

dotenv.config();

const MONGO_USERNAME = process.env.USERNAME;
const MONGO_PASSWORD = process.env.PASSWORD;
const MONGO_HOSTNAME = process.env.HOST;
const MONGO_PORT = process.env.PORT;
const MONGO_DB = process.env.DB;

const url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;

mongoose.connect(url)
    .then(() => console.log('Database Connected...'))
    .catch((error) => console.log(error));

const db = mongoose.connection;

db.on('error', (error) => {
    console.log(error)
});
db.on('disconnected', () => {
    console.log('Database Disconnected...')
});

seedAdmin(); // Adding admin to the database
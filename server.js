/**
 * @file server.js
 * @description Main entry point for the Alzine.com backend server. Sets up Express application, middleware, routes, and MongoDB connection.
 *
 * @requires path
 * @requires express
 * @requires mongoose
 * @requires cors
 * @requires body-parser
 * @requires dotenv
 * @requires ./routes/index
 * @requires ./routes/admin
 *
 * @constant {number} PORT - The port number on which the server listens (from environment variable APP_PORT or default 5000).
 * @constant {Express.Application} app - The Express application instance.
 *
 * @function
 * @name app.use
 * @description Registers middleware for CORS, body parsing, static file serving, and routes.
 *
 * @function
 * @name mongoose.connect
 * @description Establishes connection to MongoDB using environment variable MONGODB_URI.
 *
 * @function
 * @name app.get('/')
 * @description Basic route that returns a welcome message.
 *
 * @function
 * @name app.listen
 * @description Starts the Express server on the specified port.
 */
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

const router = require('./routes/index');
const adminRoutes = require('./routes/admin');

// Load environment variables from .env file
dotenv.config();

const PORT = process.env.APP_PORT || 5000;
const app = express();


// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Use only express.json() for JSON body parsing
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api', router);
app.use('/api/admin', adminRoutes);


// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Basic route
app.get('/', (req, res) => {
    res.send('Welcome to the Alzine Backend!');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
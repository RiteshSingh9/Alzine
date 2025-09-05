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
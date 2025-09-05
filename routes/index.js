const express = require('express');

const router = express.Router();

// Basic route
router.get('/', (req, res) => {
    res.send('Welcome to the Alzine Backend!');
});

router.get('/about', (req, res) => {
    res.send('About Alzine Backend');
});

router.get('/contact', (req, res) => {
    res.send('Contact Alzine Backend');
});

module.exports = router;
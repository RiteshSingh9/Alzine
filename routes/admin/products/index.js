const router = require('express').Router();
const verifyAdmin = require('../../../middlewares/verifyAdmin');
const productFormRoutes = require('./forms');

// Apply admin verification middleware to all product routes
router.use('/forms', verifyAdmin, productFormRoutes);

// Example protected route
router.post('/create', async (req, res) => {
    res.send('Product created successfully');
});

module.exports = router;
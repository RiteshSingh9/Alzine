const verifyAdmin = require('../../middlewares/verifyAdmin');
const authRoutes = require('./auth');
const productRoutes = require('./products');

const router = require('express').Router();

router.use('/auth', authRoutes);
router.use('/product', verifyAdmin, productRoutes);

router.get('/dashboard', verifyAdmin, async (req, res) => {
    res.send('Admin Dashboard');
});

module.exports = router;
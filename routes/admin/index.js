const uploadImage = require('../../middlewares/uploadImage');
const verifyAdmin = require('../../middlewares/verifyAdmin');
const authRoutes = require('./auth');
const productRoutes = require('./products');
const departmentRoutes = require('./department');

const router = require('express').Router();

router.use('/auth', authRoutes);
router.use('/product', verifyAdmin, productRoutes);
router.use('/department', verifyAdmin, departmentRoutes);
router.use('/employees', verifyAdmin, require('./employees'));

router.post('/upload/image', verifyAdmin, uploadImage, async (req, res) => {
    // Handle image upload logic here
    return res.status(201).json({ message: 'Image uploaded successfully', filePath: req.imageUrl });
});

router.get('/dashboard', verifyAdmin, async (req, res) => {
    res.send('Admin Dashboard');
});

module.exports = router;
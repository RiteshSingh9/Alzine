const { body, validationResult } = require('express-validator');
const sanitize = require('mongo-sanitize');

const router = require('express').Router();
const verifyAdmin = require('../../../middlewares/verifyAdmin');

const productFormRoutes = require('./forms');
const productApplicationRoutes = require('./application');
const Product = require('../../../models/Products');

// Apply admin verification middleware to all product routes
router.use('/forms', verifyAdmin, productFormRoutes);

// Routes to manage product applications list.
router.use('/application', verifyAdmin, productApplicationRoutes);

// Route to get all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// Example protected route
router.post('/', verifyAdmin, [
    body('product_name').trim().notEmpty().withMessage('Product name is required'),
    body('form').isArray({ min: 1 }).withMessage('Form must be a non-empty array'),
    body('form.*').isMongoId().withMessage('Each form must be a valid ID'),
    body('specification').trim().notEmpty().withMessage('Specification is required'),
    body('package').trim().notEmpty().withMessage('Package is required'),
    body('application_list').optional().isArray(),
    body('application_list.*').optional().isMongoId().withMessage('Each application must be a valid ID'),
    body('image').optional().isArray(),
    body('image.*').optional().isString()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: 'Validation Error', errors: errors.array() });
        }

        const productData = {
            product_name: sanitize(req.body.product_name),
            form: req.body.form.map(id => sanitize(id)),
            specification: sanitize(req.body.specification),
            package: sanitize(req.body.package),
            application_list: req.body.application_list ? req.body.application_list.map(id => sanitize(id)) : [],
            image: req.body.image ? req.body.image.map(img => sanitize(img)) : []
        };

        const newProduct = new Product(productData);
        await newProduct.save();
        res.status(201).json({ message: 'Product created successfully', product: newProduct });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

module.exports = router;

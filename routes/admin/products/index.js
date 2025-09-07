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
    body('product_form').isArray({ min: 1 }).withMessage('Product Form must be a non-empty array'),
    body('product_form.*').isMongoId().withMessage('Each Product form must be a valid ID'),
    body('specification').isArray({ min: 1 }).withMessage('Specification must be a non-empty array'),
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
            product_form: req.body.product_form.map(id => sanitize(id)),
            specification: sanitize(req.body.specification),
            package: sanitize(req.body.package),
            application_list: req.body.application_list ? req.body.application_list.map(id => sanitize(id)) : [],
            image: req.body.image ? sanitize(req.body.image) : []
        };

        const newProduct = new Product(productData);
        await newProduct.save();
        res.status(201).json({ message: 'Product created successfully', product: newProduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// Get all products
router.get('/', verifyAdmin, async (req, res) => {
    try {
        const products = await Product.find()
            .populate('product_form', 'form_name') // Populate form details
            .populate('application_list', 'application_name'); // Populate application details
        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// get a specific product by ID
router.get('/:id', verifyAdmin, async (req, res) => {
    try {
        const product = await Product.findById(sanitize(req.params.id))
            .populate('product_form', 'form_name')
            .populate('application_list', 'application_name');
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// update a product by ID
router.put('/:id', verifyAdmin, [
    body('product_name').optional().trim().notEmpty().withMessage('Product name cannot be empty'),
    body('product_form').optional().isArray({ min: 1 }).withMessage('Product Form must be a non-empty array'),
    body('product_form.*').optional().isMongoId().withMessage('Each Product form must be a valid ID'),
    body('specification').optional().isArray({ min: 1 }).withMessage('Specification must be a non-empty array'),
    body('package').optional().trim().notEmpty().withMessage('Package cannot be empty'),
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

        const updateData = {};
        if (req.body.product_name) updateData.product_name = sanitize(req.body.product_name);
        if (req.body.product_form) updateData.product_form = req.body.product_form.map(id => sanitize(id));
        if (req.body.specification) updateData.specification = sanitize(req.body.specification);
        if (req.body.package) updateData.package = sanitize(req.body.package);
        if (req.body.application_list) updateData.application_list = req.body.application_list.map(id => sanitize(id));
        if (req.body.image) updateData.image = sanitize(req.body.image);

        const updatedProduct = await Product.findByIdAndUpdate(
            sanitize(req.params.id),
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// Delete a product by ID
router.delete('/:id', verifyAdmin, async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(sanitize(req.params.id));
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});


module.exports = router;

const router = require('express').Router();
const ProductForm = require('../../../../models/ProductForm');

// Get all product forms
router.get('/', async (req, res) => {
    try {
        const forms = await ProductForm.find();
        res.json(forms);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

// Create a new product form
router.post('/create', async (req, res) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).send('Request body is missing');
    }
    
    const { name } = req.body;
    if (!name || name.trim() === '') {
        return res.status(400).send('Form name is required');
    }
    try {
        const existingForm = await ProductForm.findOne({ name });
        if (existingForm) {
            return res.status(400).send('Form already exists');
        }
        const newForm = new ProductForm({ name });
        await newForm.save();
        res.status(201).json({ message: 'Product form created successfully', newForm });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error', error });
    }
});


// Delete a product form by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedForm = await ProductForm.findByIdAndDelete(id);
        if (!deletedForm) {
            return res.status(404).json({ message: 'Form not found' });
        }
        res.json({ message: 'Product form deleted successfully', deletedForm });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error', error });
    }
});

// update the product form by id
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    if (!name || name.trim() === '') {
        return res.status(400).send('Form name is required');
    }
    try {
        const updatedForm = await ProductForm.findByIdAndUpdate(id, { name }, { new: true });
        if (!updatedForm) {
            return res.status(404).send('Form not found');
        }
        res.json({ message: 'Product form updated successfully', updatedForm });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});


module.exports = router;
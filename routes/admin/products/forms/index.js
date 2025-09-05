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
        res.status(201).send(`Product form created successfully with id ${newForm._id}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});


// Delete a product form by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedForm = await ProductForm.findByIdAndDelete(id);
        if (!deletedForm) {
            return res.status(404).send('Form not found');
        }
        res.send('Product form deleted successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
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
        res.send(`Product form updated successfully with id ${updatedForm._id}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});


module.exports = router;
const router = require('express').Router();

const Department = require('../../../models/Department');
const Employee = require('../../../models/Employee');

// Create a new department
router.post('/', async (req, res) => {
    try {
        const {dept_name, dept_description} = req.body;
        if (!dept_name || !dept_description) {
            return res.status(400).json({message: 'Department name and description are required.'});
        }
        const existingDept = await Department.findOne({dept_name});
        if (existingDept) {
            return res.status(400).json({message: 'Department with this name already exists.'});
        }
        const newDept = new Department({dept_name, dept_description});
        await newDept.save();
        res.status(201).json({message: 'Department created successfully.', department: newDept});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Server error.', error: error.message});
    }
});

// Get all departments
router.get('/', async (req, res) => {
    try {
        const departments = await Department.find();
        res.status(200).json(departments);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Server error.', error: error.message});
    }
});

// Get a specific department by ID
router.get('/:id', async (req, res) => {
    try {
        const department = await Department.findById(req.params.id);
        if (!department) {
            return res.status(404).json({message: 'Department not found.'});
        }
        res.status(200).json(department);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Server error.', error: error.message});
    }
});

// Update a department by ID
router.put('/:id', async (req, res) => {
    try {
        const {dept_name, dept_description} = req.body;
        const department = await Department.findById(req.params.id);
        if (!department) {
            return res.status(404).json({message: 'Department not found.'});
        }
        if (dept_name) department.dept_name = dept_name;
        if (dept_description) department.dept_description = dept_description;
        await department.save();
        res.status(200).json({message: 'Department updated successfully.', department});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Server error.', error: error.message});
    }
});

// Delete a department by ID
router.delete('/:id', async (req, res) => {
    try {
        const department = await Department.findById(req.params.id);
        if (!department) {
            return res.status(404).json({message: 'Department not found.'});
        }
        const associatedEmployees = await Employee.find({emp_department: department._id});
        if (associatedEmployees.length > 0) {
            return res.status(400).json({message: 'Cannot delete department with associated employees.'});
        }
        await department.remove();
        res.status(200).json({message: 'Department deleted successfully.'});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Server error.', error: error.message});
    }
});

module.exports = router;
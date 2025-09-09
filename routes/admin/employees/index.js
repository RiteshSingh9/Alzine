const router = require('express').Router();

const Department = require('../../../models/Department');
const Employee = require('../../../models/Employee');

// Create a Employee
router.post('/', async (req, res) => {
    try {
        const {emp_name, emp_email, emp_password, emp_contact, emp_address, emp_image, emp_department, emp_role} = req.body;
        if (!emp_name || !emp_email || !emp_password || !emp_contact || !emp_address || !emp_department) {
            return res.status(400).json({message: 'All required fields must be filled.'});
        }

        const existingEmp = await Employee.findOne({emp_email});
        if (existingEmp) {
            return res.status(400).json({message: 'Employee with this email already exists.'});
        }
        const department = await Department.findById(emp_department);
        if (!department) {
            return res.status(400).json({message: 'Invalid department ID.'});
        }
        const newEmp = new Employee({emp_name, emp_email, emp_password, emp_contact, emp_address, emp_image, emp_department, emp_role});
        await newEmp.save();
        res.status(201).json({message: 'Employee created successfully.', employee: newEmp});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Server error.', error: error.message});
    }
});

// Get all Employees
router.get('/', async (req, res) => {
    try {
        const employees = await Employee.find().populate('emp_department', 'dept_name');
        res.status(200).json(employees);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Server error.', error: error.message});
    }
});

// Get a specific Employee by ID
router.get('/:id', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id).populate('emp_department', 'dept_name');
        if (!employee) {
            return res.status(404).json({message: 'Employee not found.'});
        }
        res.status(200).json(employee);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Server error.', error: error.message});
    }
});
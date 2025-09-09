const mongoose = require('mongoose');
const {v4: uuidv4} = require('uuid');

const empSchema = new mongoose.Schema({

    emp_id: {
        type: String,
        required: true,
        unique: true
    },
    emp_name: {
        type: String,
        required: true
    },
    emp_email: {
        type: String,
        required: true,
        unique: true
    },
    emp_password: {
        type: String,
        required: true
    },
    emp_contact: [{
        type: String,
        required: true,
        unique: true
    }],
    emp_address: [{
        type: String,
        required: true
    }],
    emp_image: {
        type: String,
        default: 'default.jpg',
        required: false
    },
    emp_department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        required: true
    },
    emp_role: {
        type: String,
        enum: ['director', 'managing_director', 'manager', 'staff', 'user'],
        default: 'user'
    }
}, { timestamps: true });


// Pre-save hook to auto-generate emp_id if not present
empSchema.pre('validate', function (next) {
    if (!this.emp_id) {
        this.emp_id = uuidv4();
    }
    next();
});

const Employee = mongoose.model('Employee', empSchema);

module.exports = Employee;

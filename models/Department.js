const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    dept_name: {
        type: String,
        required: true,
        unique: true
    },
    dept_description: {
        type: String,
        required: true
    },
}, { timestamps: true }
);

module.exports = mongoose.model('Department', userSchema);

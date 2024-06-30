const mongoose = require('mongoose');

const TeacherSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    // password: {
    //     type: String,
    //     default: null
    // },
    department: {
        type: String,
        required: true
    },
    // uniqueCode: {
    //     type: String,
    //     required: true,
    //     unique: true
    // },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Teacher', TeacherSchema);

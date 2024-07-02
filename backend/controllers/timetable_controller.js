// controllers/timetable_controller.js
const Timetable = require('../models/timetable');
const { validationResult } = require('express-validator');


const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// Controller function to fetch and render timetable
module.exports.viewTimetables = async (req, res) => {
    try {
        const timetables = await Timetable.find().lean(); // Use lean() for plain JS objects
        res.render('view_timetable', { timetables, days }); // Pass days array to the template
    } catch (err) {
        console.error('Error fetching timetables:', err);
        res.status(500).send('Error fetching timetables');
    }
};



module.exports.viewDepartments = (req, res) => {
    const departments = ['CST', 'EE', 'IT']; // Example departments
    const years = [1, 2, 3, 4];
    res.render('view_departments', { departments, years });
};


module.exports.createTimetablePage = (req, res) => {
    res.render('create_timetable', {
        departments: ['CST', 'EE', 'IT'],
        years: [1, 2, 3, 4],
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        timeslots: ['9:00 - 9:55', '10:00 - 10:55', '11:00 - 11:55', '12:00 - 12:55', '1:00 - 1:55', '2:00 - 2:55', '3:00 - 3:55', '4:00 - 4:55'],
    });
};


module.exports.createTimetable = async (req, res) => {
    const { department, year, day, startTime, endTime, course, teacher } = req.body;
    
    // Validate required fields
    if (!department || !year || !day || !startTime || !endTime || !course  || !teacher) {
        return res.status(400).send('All fields are required');
    }

    try {
        // Create a new timetable entry
        const newTimetable = new Timetable({
            department,
            year,
            day,
            timeSlots: [
                {
                    startTime,
                    endTime,
                    teacher
                }
            ],
            course
        });

        // Save the new timetable entry to the database
        await newTimetable.save();

        console.log('Timetable created successfully');
        return res.redirect('back');
    } catch (err) {
        console.error('Error creating timetable:', err);
        res.status(500).send('Error creating timetable');
    }
};



module.exports.editTimetablePage = async (req, res) => {
    try {
        const timetable = await Timetable.findById(req.params.id);
        res.render('editTimetable', { timetable });
    } catch (err) {
        console.error(err);
        res.redirect('/admin/timetables');
    }
};

module.exports.editTimetable = async (req, res) => {
    const { department, course, day, timeSlots } = req.body;

    try {
        await Timetable.findByIdAndUpdate(req.params.id, { department, course, day, timeSlots });
        res.redirect('/admin/timetables');
    } catch (err) {
        console.error(err);
        res.redirect('/admin/timetables/edit/' + req.params.id);
    }
};

module.exports.deleteTimetable = async (req, res) => {
    try {
        await Timetable.findByIdAndDelete(req.params.id);
        res.redirect('/admin/timetables');
    } catch (err) {
        console.error(err);
        res.redirect('/admin/timetables');
    }
};




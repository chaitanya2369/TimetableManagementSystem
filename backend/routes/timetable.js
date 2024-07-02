// routes/timetable.js
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const timetableController = require('../controllers/timetable_controller');

// router.get('/', timetableController.viewTimetables);
router.get('/create', timetableController.createTimetablePage);
// router.post('/create', timetableController.createTimetable);
router.post('/create', [
    check('course', 'Course name is required').notEmpty(),
    check('day', 'Day of the week is required').notEmpty(),
    check('timeSlots', 'Timetable slots are required').isArray({ min: 1 }),
], timetableController.createTimetable);
router.get('/edit/:id', timetableController.editTimetablePage);
router.post('/edit/:id', timetableController.editTimetable);
router.post('/delete/:id', timetableController.deleteTimetable);

router.get('/', timetableController.viewDepartments); // Route to view departments and years
router.get('/:department/:year', timetableController.viewTimetables); // Route to view specific year's timetable

module.exports = router;

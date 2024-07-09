const express = require('express');
const router = express.Router();
const studentController = require('../controllers/student_controller');
const student = require('../models/student');

router.get('/dashboard', studentController.dashboard);
router.get('/timetables',studentController.viewTimetables);

// router.get('/notifications',studentController.notifications);

router.use('/notifications',require('../routes/notification'))

module.exports = router;

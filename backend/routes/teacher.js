const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacher_controller');

router.get('/dashboard', teacherController.dashboard);
router.get('/timetables',teacherController.viewTeacherTimetables);

module.exports = router;

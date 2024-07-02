const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin_controller');
const timetableController = require('../controllers/timetable_controller')
router.get('/dashboard', adminController.dashboard);
router.get('/users/add', adminController.addUser);
router.post('/users/add', adminController.addedUser);
router.get('/users', adminController.users);
router.get('/users/students/:department', adminController.viewStudents);
router.get('/users/teachers/:department', adminController.viewTeachers);

module.exports = router;

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin_controller');
const timetableController = require('../controllers/timetable_controller')
const notificationController = require('../controllers/notification_controller');
router.get('/dashboard', adminController.dashboard);
router.get('/users/add', adminController.addUser);
router.post('/users/add', adminController.addedUser);
router.get('/users', adminController.users);
router.get('/users/students/:department', adminController.viewStudents);
router.get('/users/teachers/:department', adminController.viewTeachers);


router.get('/analytics',adminController.getAnalytics);
// Route to view notifications
router.get('/notifications', notificationController.viewNotifications);

// Route to create a new notification
router.post('/notifications/create', notificationController.createNotification);

// Edit notification
router.get('/notifications/edit/:id', notificationController.getEditNotification); // Render edit form
router.post('/notifications/edit/:id', notificationController.editNotification);    // Handle form submission

// Delete notification
router.post('/notifications/delete/:id', notificationController.deleteNotification);

module.exports = router;

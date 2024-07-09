// routes/index.js
const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification_controller');
const studentController = require('../controllers/notification_controller');
// Other routes
router.get('/',notificationController.notifications);
router.post('/mark-as-read/:id', notificationController.markAsRead);
router.post('/mark-as-unread/:id', notificationController.markAsUnread);
router.post('/star/:id', notificationController.star);
router.post('/unstar/:id', notificationController.unstar);
router.get('/starred', notificationController.starredNotifications);

module.exports = router;

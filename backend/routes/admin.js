const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin_controller');
router.get('/dashboard', adminController.dashboard);

router.get('/users/add',adminController.addUser);
router.post('/users/add',adminController.addedUser);

router.get('/users',adminController.users);
// router.post('/register',adminController.register)

module.exports = router;

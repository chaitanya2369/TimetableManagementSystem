const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home_controller');

console.log('Home loaded');

router.get('/', homeController.home);

// router.get('/dashboard', homeController.dashboard);
router.use('/users', require('./users'));

module.exports = router;

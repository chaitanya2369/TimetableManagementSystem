const express = require('express');
const router = express.Router();
const userController = require('../controllers/user_controller');

router.get('/sign-up', userController.signUpPage);
router.post('/sign-up', userController.signUp);

router.get('/sign-in', userController.signInPage);
router.post('/sign-in', userController.signIn);

router.get('/sign-out', userController.signOut);



module.exports = router;

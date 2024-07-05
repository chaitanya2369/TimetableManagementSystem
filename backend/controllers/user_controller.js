const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secretKey = "12345"; 
const Student = require('../models/student');
const Teacher = require('../models/teacher');

module.exports.signUpPage = (req, res) => {
    res.render('sign-up');
};


module.exports.signUp = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        // Check if the email already exists in the students or teachers collection
        const isUserInStudents = await Student.findOne({ email });
        const isUserInTeachers = await Teacher.findOne({ email });
        
        if (!isUserInStudents && !isUserInTeachers) {
            return res.render('sign-up', { error: 'User not found. Kindly contact Admin.' });
        }
        
        // Check if the email already exists in the User collection
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.render('sign-up', { error: 'Email already exists. Try signing in.' });
        }

        // Hash the password and create a new user
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword, role });
        await user.save();

        res.redirect('/users/sign-in');
    } catch (error) {
        console.error('Error during sign up:', error);
        res.render('sign-up', { error: 'An error occurred during sign up. Please try again later.' });
    }
};

module.exports.signInPage = (req, res) => {
        if(req.user){
            if (req.user.role === 'admin') {
                res.redirect('/admin/dashboard');
            } else if (req.user.role === 'teacher') {
                res.redirect('/teacher/dashboard');
            } else if (req.user.role === 'student') {
                res.redirect('/student/dashboard');
            } else {
                res.redirect('/');
            }
        }
        else{
            res.render('sign-in', { error: null });
        }
};

module.exports.signIn = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.render('sign-in', { error: 'Email not found' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.render('sign-in', { error: 'Password mismatch' });
        }

        // Include the role in the token payload
        const token = jwt.sign({ userId: user._id, email: user.email, name: user.name, role: user.role }, secretKey, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true });

        // Redirect based on user role
        if (user.role === 'admin') {
            res.redirect('/admin/dashboard');
        } else if (user.role === 'teacher') {
            res.redirect('/teacher/dashboard');
        } else if (user.role === 'student') {
            res.redirect('/student/dashboard');
        } else {
            res.redirect('/');
        }
    } catch (error) {
        res.render('sign-in', { error: 'An error occurred, please try again' });
    }
};

module.exports.signOut = (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
};


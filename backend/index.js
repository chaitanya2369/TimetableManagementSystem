const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const app = express();
const port = 9000;

const secretKey = '12345'; 

// Connect to MongoDB
mongoose.connect('mongodb://localhost/timetable_management').then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.log('Failed to connect to MongoDB', err);
});

// Middleware for parsing request bodies, serving static files, and handling cookies
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../frontend/assets')));
app.use(cookieParser());

// Session handling
app.use(session({
    secret: secretKey,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: 'mongodb://localhost/timetable_management' })
}));

// Set up view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../frontend/views'));

// Middleware to check JWT token
function checkToken(req, res, next) {
    const token = req.cookies.token;
    if (token) {
        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                console.log('Token verification failed:', err);
                return res.redirect('/users/sign-in');
            }
            req.user = decoded;
            next();
        });
    } else {
        next();
    }
}

// Middleware to ensure user is authenticated and has the appropriate role
function ensureAuthenticated(role) {
    return (req, res, next) => {
        if (req.user && req.user.role === role) {
            return next();
        } else {
            res.redirect('/users/sign-in');
        }
    };
}

// Routes
app.use(checkToken);
app.use('/admin', ensureAuthenticated('admin'), require('./routes/admin'));
app.use('/teacher', ensureAuthenticated('teacher'), require('./routes/teacher'));
app.use('/student', ensureAuthenticated('student'), require('./routes/student'));
app.use('/users', require('./routes/users'));
app.use('/', require('./routes/home'));
app.use('/admin/timetables', require('./routes/timetable'));

// Start the server
app.listen(port, function (err) {
    if (err) {
        console.log("Error in connecting to the server!!! ", err);
        return;
    }
    console.log("Hurray! The server is running at port: ", port);
});

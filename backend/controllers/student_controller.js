const Timetable = require('../models/timetable');
const Student = require('../models/student'); // Updated to use singular Student for consistency

module.exports.dashboard = (req, res) => {
    if (req.user && req.user.role === 'student') {
        res.render('student_dashboard', { user: req.user });
    } else {
        res.redirect('/users/sign-in');
    }
};

module.exports.viewTimetables = async (req, res) => {
    try {
        const email = req.user.email; // Extract email from req.user
        console.log(req.user);
        
        // Fetch student details based on the email
        const studentDetails = await Student.findOne({ email });
        if (!studentDetails) {
            return res.status(404).send('Student not found');
        }
        console.log(studentDetails);
        
        const department = studentDetails.department;
        const year = 1;
        
        // Fetch timetables for the specific department and year
        const timetables = await Timetable.find({ department, year }).lean();
        console.log(timetables);
        
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']; // Define days array here
        
        // Render the view and pass necessary data
        res.render('view_timetable', { timetables, days, department, year });
    } catch (err) {
        console.error('Error fetching timetables:', err);
        res.status(500).send('Error fetching timetables');
    }
};

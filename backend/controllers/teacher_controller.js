const Timetable = require('../models/timetable');
const Teacher = require('../models/teacher'); // Assuming you have a Teacher model
const Notification = require('../models/notification');


module.exports.dashboard = async (req, res) => {
    if (req.user) {
        if (req.user.role === 'teacher') {
            const notifications = await Notification.find({ recipientType: 'teacher', department: req.user.department }).lean();
            res.render('teacher_dashboard', { user: req.user, notifications });
        } else {
            res.redirect('/users/sign-in');
        }
    }
};

module.exports.viewTeacherTimetables = async (req, res) => {
    try {
        const email = req.user.email; // Extract email from req.user
        console.log(req.user);

        // Fetch teacher details based on the email
        const teacherDetails = await Teacher.findOne({ email });
        if (!teacherDetails) {
            return res.status(404).send('Teacher not found');
        }

        const teacherName = teacherDetails.name;

        // Fetch timetables where the teacher is assigned
        const timetables = await Timetable.find({
            'days.timeSlots.teacher': teacherName
        }).lean();

        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

        // Render the view and pass necessary data
        res.render('viewteachertimetable', { timetables, days, teacherName });
    } catch (err) {
        console.error('Error fetching timetables:', err);
        res.status(500).send('Error fetching timetables');
    }
};

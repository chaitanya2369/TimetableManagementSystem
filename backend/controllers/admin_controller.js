const Student = require('../models/student');
const Teacher = require('../models/teacher');
const Timetable = require('../models/timetable');

async function generateUniqueCode(department) {
    const year = new Date().getFullYear();
    const prefix = `${year}${department}`;

    // Count the number of users in the same department and year
    const count = await Student.countDocuments({ uniqueCode: new RegExp(`^${prefix}`) });
    const codeNumber = (count + 1).toString().padStart(3, '0');

    return `${prefix}${codeNumber}`;
}

module.exports.dashboard = (req, res) => {
    res.render('admin_dashboard', { user: req.user });
};

module.exports.users = async (req, res) => {
    try {
        const students = await Student.find().sort({ department: 1, uniqueCode: 1 });
        const teachers = await Teacher.find().sort({ department: 1, name: 1 });

        const departments = {};

        // Group students by department
        students.forEach(student => {
            if (!departments[student.department]) {
                departments[student.department] = { students: [], teachers: [] };
            }
            departments[student.department].students.push(student);
        });

        // Group teachers by department
        teachers.forEach(teacher => {
            if (!departments[teacher.department]) {
                departments[teacher.department] = { students: [], teachers: [] };
            }
            departments[teacher.department].teachers.push(teacher);
        });

        res.render('users', { user: req.user, departments });
    } catch (err) {
        console.error(err);
        res.redirect('/admin/dashboard');
    }
};

module.exports.addUser = (req, res) => {
    res.render('addUser', { user: req.user });
};

module.exports.addedUser = async (req, res) => {
    const { name, email, department, year, role } = req.body;
    let errors = [];

    if (!name || !email || !department || !role || (role === 'student' && !year)) {
        errors.push({ msg: 'Please fill in all fields' });
    }

    if (errors.length > 0) {
        return res.render('addUser', { errors, name, email, department, year, role, user: req.user });
    }

    try {
        const existingUser = await (role === 'student' ? Student.findOne({ email }) : Teacher.findOne({ email }));
        if (existingUser) {
            errors.push({ msg: 'Email is already registered' });
            return res.render('addUser', { errors, name, email, department, year, role, user: req.user });
        }

        let newUser;
        if (role === 'student') {
            const uniqueCode = await generateUniqueCode(department);
            newUser = new Student({
                name,
                email,
                department,
                uniqueCode,
                year
            });
        } else {
            newUser = new Teacher({
                name,
                email,
                department
            });
        }

        await newUser.save();
        console.log('User added: ', newUser);
        res.redirect('/admin/dashboard');
    } catch (err) {
        console.log(err);
        errors.push({ msg: 'An error occurred while adding the user. Please try again.' });
        res.render('addUser', { errors, name, email, department, year, role, user: req.user });
    }
};

module.exports.viewStudents = async (req, res) => {
    const department = req.params.department;
    try {
        const students = await Student.find({ department }).sort({ uniqueCode: 1 });
        res.render('view_students', { user: req.user, department, students });
    } catch (err) {
        console.error(err);
        res.redirect('/admin/users');
    }
};

module.exports.viewTeachers = async (req, res) => {
    const department = req.params.department;
    try {
        const teachers = await Teacher.find({ department }).sort({ name: 1 });
        res.render('view_teachers', { user: req.user, department, teachers });
    } catch (err) {
        console.error(err);
        res.redirect('/admin/users');
    }
};


module.exports.getAnalytics = async (req, res) => {
    try {
        // Fetch user statistics
        const totalStudents = await Student.countDocuments();
        const totalTeachers = await Teacher.countDocuments();

        const studentsByDepartment = await Student.aggregate([
            { $group: { _id: "$department", count: { $sum: 1 } } }
        ]);

        const teachersByDepartment = await Teacher.aggregate([
            { $group: { _id: "$department", count: { $sum: 1 } } }
        ]);

        // Fetch timetable statistics
        const totalTimeslots = 8 * 7; // Assuming 8 slots per day for 7 days
        const scheduledTimeslots = await Timetable.aggregate([
            { $unwind: "$days" },
            { $unwind: "$days.timeSlots" },
            { $group: { _id: null, count: { $sum: 1 } } }
        ]);

        // Fetch conflict statistics (assuming you have a conflict collection or a way to track conflicts)
        // const conflicts = await Conflict.countDocuments(); // Replace with actual conflict collection/query if available

        // Prepare data for the view
        const analyticsData = {
            totalStudents,
            totalTeachers,
            studentsByDepartment,
            teachersByDepartment,
            totalTimeslots,
            scheduledTimeslots: scheduledTimeslots[0] ? scheduledTimeslots[0].count : 0,
            // conflicts
        };

        res.render('admin_analytics', { analyticsData });
    } catch (error) {
        console.error('Error fetching analytics data:', error);
        res.status(500).send('Error fetching analytics data');
    }
};
const Student = require('../models/student');
const Teacher = require('../models/teacher');

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
    const { name, email, department,year, role } = req.body;
    let errors = [];

    if (!name || !email || !department || !role || !year) {
        errors.push({ msg: 'Please fill in all fields' });
    }

    if (errors.length > 0) {
        res.render('addUser', { errors, name, email, department,year, role, user: req.user });
    } else {
        try {
            const existingUser = await (role === 'student' ? Student.findOne({ email }) : Teacher.findOne({ email }));
            if (existingUser) {
                errors.push({ msg: 'Email is already registered' });
                res.render('addUser', { errors, name, email, department, role, year, user: req.user });
            } else {
                const uniqueCode = await generateUniqueCode(department);
                const newUser = role === 'student' ? new Student({
                    name,
                    email,
                    department,
                    uniqueCode,
                    year,
                }) : new Teacher({
                    name,
                    email,
                    department
                });

                newUser.save()
                    .then(user => {
                        console.log('User added: ', user);
                        res.redirect('/admin/dashboard');
                    })
                    .catch(err => console.log(err));
            }
        } catch (err) {
            console.log(err);
            res.render('addUser', { errors, name, email, department, role,year, user: req.user });
        }
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
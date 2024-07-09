// controllers/notificationsController.js
const Notification = require('../models/notification');
const Student = require('../models/student');
const Teacher = require('../models/teacher');

module.exports.viewNotifications = async (req, res) => {
  try {
      const notifications = await Notification.find().lean(); // Fetch all notifications
      console.log(notifications);
      res.render('admin_notifications', {user:req.user, notifications });
  } catch (err) {
      console.error('Error fetching notifications:', err);
      res.status(500).send('Error fetching notifications');
  }
};

// Create notification
// module.exports.createNotification = async (req, res) => {
//   const { title, message, recipientType, department, year, expiresAt } = req.body;
//   try {
//       const newNotification = new Notification({
//           title,
//           message,
//           recipientType,
//           department,
//           year,
//           expiresAt: expiresAt ? new Date(expiresAt) : undefined
//       });
//       await newNotification.save();
//       res.redirect('/admin/notifications');
//   } catch (err) {
//       console.error('Error creating notification:', err);
//       res.status(500).send('Error creating notification');
//   }
// };
// module.exports.createNotification = async (req, res) => {
//     const { title, message, recipientType, department, year } = req.body;
//     let notifications = [];

//     if (recipientType === 'all_students') {
//         const students = await Student.find();
//         students.forEach(student => {
//             notifications.push({
//                 title,
//                 message,
//                 recipientType: 'student',
//                 department: student.department,
//                 year: student.year,
//                 read: false,
//                 date: new Date()
//             });
//         });
//     } else if (recipientType === 'all_teachers') {
//         const teachers = await Teacher.find();
//         teachers.forEach(teacher => {
//             notifications.push({
//                 title,
//                 message,
//                 recipientType: 'teacher',
//                 department: teacher.department,
//                 read: false,
//                 date: new Date()
//             });
//         });
//     } else {
//         notifications.push({
//             title,
//             message,
//             recipientType,
//             department,
//             year: recipientType === 'student' ? year : null,
//             read: false,
//             date: new Date()
//         });
//     }

//     await Notification.insertMany(notifications);
//     res.redirect('/admin/notifications');
// };

module.exports.createNotification = async (req, res) => {
    const { title, message, recipientType, department, year } = req.body;
    let notifications = [];
    
    const validDepartments = ['CST', 'IT', 'EE']; // Define your valid departments here
    const validYears = [1, 2, 3, 4]; // Define your valid years here

    try {
        if (!title || !message || !recipientType || !department || (recipientType === 'student' && !year)) {
            throw new Error("All fields are required.");
        }
        
        if (!validDepartments.includes(department)) {
            throw new Error("Invalid department.");
        }
        
        if (recipientType === 'student' && !validYears.includes(parseInt(year)) && year === 5) {
            throw new Error("Invalid year.");
        }
        
        if (recipientType === 'all_students') {
            validDepartments.forEach(dept => {
                validYears.forEach(y => {
                    notifications.push({
                        title,
                        message,
                        recipientType: 'student',
                        department: dept,
                        year: y,
                        read: false,
                        date: new Date()
                    });
                });
            });
        } else if (recipientType === 'all_teachers') {
            validDepartments.forEach(dept => {
                notifications.push({
                    title,
                    message,
                    recipientType: 'teacher',
                    department: dept,
                    read: false,
                    date: new Date()
                });
            });
        } else if (year === '5') { // Assuming '5' represents all years
            validYears.forEach(y => {
                notifications.push({
                    title,
                    message,
                    recipientType,
                    department,
                    year: y,
                    read: false,
                    date: new Date()
                });
            });
        } else {
            notifications.push({
                title,
                message,
                recipientType,
                department,
                year: recipientType === 'student' ? year : null,
                read: false,
                date: new Date()
            });
        }

        await Notification.insertMany(notifications);
        res.redirect('/admin/notifications');
    } catch (error) {
        console.error(error);
        res.status(400).send({ error: error.message });
    }
};


// Get edit notification form
module.exports.getEditNotification = async (req, res) => {
  const { id } = req.params;
  try {
      const notification = await Notification.findById(id).lean();
      if (!notification) {
          return res.status(404).send('Notification not found');
      }
      res.render('edit_notification', { notification });
  } catch (err) {
      console.error('Error fetching notification:', err);
      res.status(500).send('Error fetching notification');
  }
};

// Edit notification
module.exports.editNotification = async (req, res) => {
  const { id } = req.params;
  const { title, message } = req.body;
  try {
      await Notification.findByIdAndUpdate(id, { title, message, expiresAt: new Date() });
      res.redirect('/admin/notifications');
  } catch (err) {
      console.error('Error editing notification:', err);
      res.status(500).send('Error editing notification');
  }
};

// Delete notification
module.exports.deleteNotification = async (req, res) => {
  const { id } = req.params;
  try {
      await Notification.findByIdAndDelete(id);
      res.redirect('/admin/notifications');
  } catch (err) {
      console.error('Error deleting notification:', err);
      res.status(500).send('Error deleting notification');
  }
};


// module.exports.notifications = async (req, res) => {
//     if (req.user) {
//         if (req.user.role === 'student') {
//             const email = req.user.email;
//             const student = await Student.findOne({ email });
//             const notifications = await Notification.find({
//                 recipientType: 'student',
//                 department: student.department,
//                 year: student.year
//             }).sort({ date: -1 }).lean();

//             res.render('student_notification', { user: req.user, notifications });
//         } else {
//             res.redirect('/users/sign-in');
//         }
//     }
// };
module.exports.notifications = async (req, res) => {
    if (req.user) {
        if (req.user.role === 'student') {
            const email = req.user.email;
            const student = await Student.findOne({ email });
            const notifications = await Notification.find({
                recipientType: 'student',
                department: student.department,
                year: student.year
            }).sort({ date: -1 }).lean();

            res.render('user_notification', { user: req.user, notifications });
        }else if(req.user.role === 'teacher') {
            const email = req.user.email;
            const teacher = await Teacher.findOne({ email });
            const notifications = await Notification.find({
                recipientType: 'teacher',
                department: teacher.department
            }).sort({ date: -1 }).lean();

            res.render('student_notification', { user: req.user, notifications });
        } else {
            res.redirect('/users/sign-in');
        }
    }
};

module.exports.markAsRead = async (req, res) => {
    await Notification.findByIdAndUpdate(req.params.id, { read: true });
    res.redirect('back');
};

module.exports.markAsUnread = async (req, res) => {
    await Notification.findByIdAndUpdate(req.params.id, { read: false });
    res.redirect('back');
};

module.exports.star = async (req, res) => {
    await Notification.findByIdAndUpdate(req.params.id, { starred: true });
    res.redirect('back');
};

module.exports.unstar = async (req, res) => {
    await Notification.findByIdAndUpdate(req.params.id, { starred: false });
    res.redirect('back');
};

module.exports.starredNotifications = async (req, res) => {
    if (req.user) {
        if (req.user.role === 'student') {
            const email = req.user.email;
            const student = await Student.findOne({ email });
            const notifications = await Notification.find({
                recipientType: 'student',
                department: student.department,
                year: student.year,
                starred: true
            }).sort({ date: -1 }).lean();

            res.render('student_notification_starred', { user: req.user, notifications });
        } else {
            res.redirect('/users/sign-in');
        }
    }
};

// controllers/timetable_controller.js
const timetable = require('../models/timetable');
const Timetable = require('../models/timetable');
const { validationResult } = require('express-validator');


// module.exports.viewTimetables = async (req, res) => {
  //     try {
    //         const timetables = await Timetable.find().lean(); // Use lean() for plain JS objects
    //         const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    //         res.render('view_timetable', { timetables, days }); // Pass days array to the template
    //     } catch (err) {
      //         console.error('Error fetching timetables:', err);
      //         res.status(500).send('Error fetching timetables');
      //     }
      // };
      // const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      module.exports.viewTimetables = async (req, res) => {
        try {
      const { department, year } = req.params; 
      // console.log(department);// Assuming department and year are passed as query parameters
      // console.log(year);// Assuming department and year are passed as query parameters
      const timetables = await Timetable.find({ department, year }).lean(); // Fetch timetables for the specific department and year
      console.log(timetables);
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']; // Define days array here
      res.render('view_timetable', { timetables, days, department, year }); // Pass days, department, and year to the template
  } catch (err) {
      console.error('Error fetching timetables:', err);
      res.status(500).send('Error fetching timetables');
  }
};

module.exports.viewDepartments = (req, res) => {
    const departments = ['CST', 'EE', 'IT']; // Example departments
    const years = [1, 2, 3, 4];
    res.render('view_departments', { departments, years });
};


module.exports.createTimetablePage = (req, res) => {
    res.render('create_timetable', {
        departments: ['CST', 'EE', 'IT'],
        years: [1, 2, 3, 4],
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        timeslots: ['9:00 - 9:55', '10:00 - 10:55', '11:00 - 11:55', '12:00 - 12:55', '1:00 - 1:55', '2:00 - 2:55', '3:00 - 3:55', '4:00 - 4:55'],
    });
};

module.exports.createTimetable = async (req, res) => {
  try {
    const { department, year, day, startTime, endTime, course, teacher } = req.body;
    console.log(req.body);

    // Validate input
    if (!department || !year || !day || !startTime || !endTime || !course || !teacher) {
      return res.status(400).json({ message: 'Invalid input' });
    }

    // Convert time to minutes for easier comparison
    const convertTimeToMinutes = (time) => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    };

    const newStart = convertTimeToMinutes(startTime);
    const newEnd = convertTimeToMinutes(endTime);

    // Find the existing timetable for the department and year
    let timetable = await Timetable.findOne({ department, year });

    if (timetable) {
      // Check if the day already exists in the timetable
      let dayEntry = timetable.days.find(d => d.day === day);
      if (dayEntry) {
        // Check for conflicts with existing time slots
        const conflict = dayEntry.timeSlots.some(slot => {
          const existingStart = convertTimeToMinutes(slot.startTime);
          const existingEnd = convertTimeToMinutes(slot.endTime);
          return (newStart < existingEnd && newEnd > existingStart);
        });

        if (conflict) {
          return res.status(400).json({ message: 'Time slot conflict detected' });
        }

        // Add the new time slot to the existing day entry
        dayEntry.timeSlots.push({ startTime, endTime, course, teacher });
      } else {
        // Create a new day entry if it doesn't exist
        timetable.days.push({
          day,
          timeSlots: [{ startTime, endTime, course, teacher }]
        });
      }
    } else {
      // Create a new timetable if it doesn't exist
      timetable = new Timetable({
        department,
        year,
        days: [{
          day,
          timeSlots: [{ startTime, endTime, course, teacher }]
        }]
      });
    }

    // Save the updated timetable to the database
    await timetable.save();

    res.status(201).json({ message: 'Timetable created/updated successfully', timetable });
  } catch (error) {
    res.status(500).json({ message: 'Error creating/updating timetable', error });
  }
};

// module.exports.createTimetable = async (req, res) => {
//     try {
//       const { department, year, day, startTime, endTime, course, teacher } = req.body;
//       console.log(req.body);
  
//       // Validate input
//       if (!department || !year || !day || !startTime || !endTime || !course || !teacher) {
//         return res.status(400).json({ message: 'Invalid input' });
//       }
  
//       // Convert time to minutes for easier comparison
//       const convertTimeToMinutes = (time) => {
//         const [hours, minutes] = time.split(':').map(Number);
//         return hours * 60 + minutes;
//       };
  
//       const newStart = convertTimeToMinutes(startTime);
//       const newEnd = convertTimeToMinutes(endTime);
  
//       // Find the existing timetable for the department and year
//       let timetable = await Timetable.findOne({ department, year });
  
//       if (timetable) {
//         // Check if the day already exists in the timetable
//         let dayEntry = timetable.days.find(d => d.day === day);
//         if (dayEntry) {
//           // Check for conflicts with existing time slots
//           const conflict = dayEntry.timeSlots.some(slot => {
//             const existingStart = convertTimeToMinutes(slot.startTime);
//             const existingEnd = convertTimeToMinutes(slot.endTime);
//             return (newStart < existingEnd && newEnd > existingStart);
//           });
  
//           if (conflict) {
//             return res.status(400).json({ message: 'Time slot conflict detected' });
//           }
  
//           // Add the new time slot to the existing day entry
//           dayEntry.timeSlots.push({ startTime, endTime, course, teacher });
//         } else {
//           // Create a new day entry if it doesn't exist
//           timetable.days.push({
//             day,
//             timeSlots: [{ startTime, endTime, course, teacher }]
//           });
//         }
//       } else {
//         // Create a new timetable if it doesn't exist
//         timetable = new Timetable({
//           department,
//           year,
//           days: [{
//             day,
//             timeSlots: [{ startTime, endTime, course, teacher }]
//           }]
//         });
//       }
  
//       // Save the updated timetable to the database
//       await timetable.save();
  
//       res.status(201).json({ message: 'Timetable created/updated successfully', timetable });
//     } catch (error) {
//       res.status(500).json({ message: 'Error creating/updating timetable', error });
//     }
//   };

module.exports.editTimetablePage = async (req, res) => {
    try {
        const timetable = await Timetable.findById(req.params.id);
        res.render('editTimetable', { timetable });
    } catch (err) {
        console.error(err);
        res.redirect('/admin/timetables');
    }
};

module.exports.editTimetable = async (req, res) => {
    const { department, course, day, timeSlots } = req.body;

    try {
        await Timetable.findByIdAndUpdate(req.params.id, { department, course, day, timeSlots });
        res.redirect('/admin/timetables');
    } catch (err) {
        console.error(err);
        res.redirect('/admin/timetables/edit/' + req.params.id);
    }
};

module.exports.deleteTimetable = async (req, res) => {
    try {
        await Timetable.findByIdAndDelete(req.params.id);
        res.redirect('/admin/timetables');
    } catch (err) {
        console.error(err);
        res.redirect('/admin/timetables');
    }
};




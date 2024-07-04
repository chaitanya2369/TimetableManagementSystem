// // // models/timetable.js
// const mongoose = require('mongoose');

// const timeSlotSchema = new mongoose.Schema({
//     startTime: {
//         type: String,
//         required: true
//     },
//     endTime: {
//         type: String,
//         required: true
//     },
//     // subject: {
//     //     type: String,
//     //     required: true
//     // },
//     teacher: {
//         type: String,
//         required: true
//     }
// });

// const timetableSchema = new mongoose.Schema({
//     course: {
//         type: String,
//         required: true
//     },
//     day: {
//         type: String,
//         required: true
//     },
//     timeSlots: [timeSlotSchema]
// });

// module.exports = mongoose.model('Timetable', timetableSchema);

// models/timetable.js
const mongoose = require('mongoose');

const timeSlotSchema = new mongoose.Schema({
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  course: {
    type: String,
    required: true
  },
  teacher: {
    type: String,
    required: true
  }
});

const daySchema = new mongoose.Schema({
  day: {
    type: String,
    required: true
  },
  timeSlots: [timeSlotSchema]
});

const timetableSchema = new mongoose.Schema({
  department: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  days: [daySchema]
});

module.exports = mongoose.model('Timetable', timetableSchema);

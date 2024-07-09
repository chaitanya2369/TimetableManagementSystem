// const mongoose = require('mongoose');

// const notificationSchema = new mongoose.Schema({
//     title: {
//         type: String,
//         required: true
//     },
//     message: {
//         type: String,
//         required: true
//     },
//     recipientType: {
//         type: String,
//         enum: ['student', 'teacher'],
//         required: true
//     },
//     department: {
//         type: String,
//         required: true
//     },
//     year: {
//         type: Number,
//         required: function() { return this.recipientType === 'student'; }
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now
//     },
//     expiresAt: {
//         type: Date,
//         default: function() {
//             const now = new Date();
//             now.setDate(now.getDate() + 7); // Set default expiry to 7 days from creation
//             return now;
//         }
//     },
//     read: {
//         type: Boolean,
//         default: false
//     }
// });

// module.exports = mongoose.model('Notification', notificationSchema);

const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  recipientType: {
    type: String,
    enum: ['student', 'teacher'],
    required: true
  },
  department: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: function() { return this.recipientType === 'student'; }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    default: function() {
        const now = new Date();
        now.setDate(now.getDate() + 7); // Set default expiry to 7 days from creation
        return now;
    }
  },
  read: {
    type: Boolean,
    default: false
  },
  starred: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Notification', notificationSchema);

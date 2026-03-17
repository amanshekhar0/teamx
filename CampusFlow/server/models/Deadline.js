const mongoose = require('mongoose');

const deadlineSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  dateTimeIso: {
    type: Date,
    required: true,
  },
  associated_phone: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Deadline', deadlineSchema);

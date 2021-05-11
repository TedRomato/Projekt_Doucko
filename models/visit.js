const mongoose = require('mongoose');

const visit = new mongoose.Schema({
  visitDate: {
    type: Date,
    require: true,
    default: Date.now
  }
});

module.exports = mongoose.model("Visit", visit);

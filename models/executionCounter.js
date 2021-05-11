const mongoose = require('mongoose');

const executionCounter = new mongoose.Schema({
  executions: {
    type: Number,
    require: true
    }
  },{collection: "executionCounter"}
);

module.exports = mongoose.model("ExecutionCounter", executionCounter);

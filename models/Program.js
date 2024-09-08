// models/Program.js
const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  courseId: {
    type: String,
    required: true,
  },
  eName: {
    type: String,
    required: true,
  },
  tName: {
    type: String,
    required: true,
  },
  credit: {
    type: String,
    required: true,
  },
  courseType: {
    type: String,
    required: true,
  },
});

const ProgramSchema = new mongoose.Schema({
  faculty: {
    type: String,
    required: true,
  },
  program: {
    type: String,
    required: true,
  },
  degree: {
    type: String,
    required: true,
  },
  established: {
    type: String,
    required: true,
  },
  plan: {
    type: String,
    required: true,
  },
  courses: [CourseSchema],
});

module.exports = mongoose.model("Program", ProgramSchema);

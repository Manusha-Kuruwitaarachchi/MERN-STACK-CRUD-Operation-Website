const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  name: String,
  email: String,
  image: Buffer, // Store image data as a buffer
  status: String,
});

const StudentModel = mongoose.model("students", StudentSchema);
module.exports = StudentModel;

// app.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const AdminModel = require('../server/models/admin');
const StudentModel = require('../server/models/students');

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/MERN', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit
});

// Route to handle student creation with image upload
app.post('/create/student', upload.single('image'), async (req, res) => {
  try {
    const { name, email, status } = req.body;
    const image = req.file.buffer;

    const student = new StudentModel({ name, email, image, status });
    await student.save();

    res.status(201).json({ message: 'Student created successfully', student });
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(500).json({ error: 'Failed to create student.' });
  }
});

// Route to update student data
app.put('/update/student/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, status } = req.body;
  
  try {
    const updatedStudent = await StudentModel.findByIdAndUpdate(id, { name, email, status }, { new: true });
    res.json({ message: 'Student updated successfully', student: updatedStudent });
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ error: 'Failed to update student.' });
  }
});

// Route to delete student data
app.delete('/delete/student/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedStudent = await StudentModel.findByIdAndDelete(id);
    if (!deletedStudent) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json({ message: 'Student deleted successfully', student: deletedStudent });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ error: 'Failed to delete student.' });
  }
});

// Route to handle admin registration
app.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingAdmin = await AdminModel.findOne({ email });
    if (existingAdmin) {
      return res.status(400).send("Admin with this email already exists.");
    }

    const newAdmin = await AdminModel.create({ email, password });
    res.status(201).send("Admin registered successfully.");
  } catch (error) {
    console.error("Error registering admin:", error);
    res.status(500).send("An error occurred. Please try again.");
  }
});

// Route to handle admin login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await AdminModel.findOne({ email, password });
    if (admin) {
      res.send("Success");
    } else {
      res.status(401).send("Invalid email or password");
    }
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).send("An error occurred. Please try again.");
  }
});

// Route to fetch all students with image data
app.get('/show/students', async (req, res) => {
  try {
    const students = await StudentModel.find();
    const studentsWithImages = students.map(student => ({
      ...student._doc,
      image: student.image.toString('base64')
    }));
    res.json(studentsWithImages);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Failed to fetch students.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

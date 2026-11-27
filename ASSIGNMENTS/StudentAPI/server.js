const express = require('express');
const mongoose = require('mongoose');

const app = express();

app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/college')
.then(() => console.log("MongoDB Connected"));

// Student Schema
const Student = mongoose.model('Student', {
    name: String,
    rollno: Number,
    course: String
});

// 1. POST - Add Student
app.post('/students', async (req, res) => {
    const student = await Student.create(req.body);
    res.send("Student Added Successfully");
});

// 2. GET - Display All Students
app.get('/students', async (req, res) => {
    const data = await Student.find();
    res.send(data);
});

// 3. PUT - Update Student
app.put('/students/:id', async (req, res) => {
    await Student.findByIdAndUpdate(
        req.params.id, req.body
    );
    res.send("Student Updated");
});

// 4. DELETE - Delete Student
app.delete('/students/:id', async (req, res) => {
    await Student.findByIdAndDelete(req.params.id);
    res.send("Student Deleted");
});

// Start Server
app.listen(5000, () => {
    console.log("Server Started");
});
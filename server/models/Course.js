import mongoose from 'mongoose';

const CourseSchema = new mongoose.Schema({
  name: { 
    type: String,
    required: true
  },
  description: String,
  category: String
});

// กำหนดให้ Model นี้เชื่อมโยงกับ Collection ชื่อ 'courses'
const Course = mongoose.model('Course', CourseSchema, 'courses'); 

export default Course;
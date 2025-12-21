import mongoose from 'mongoose';

const CourseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  category: String,
  sections: [{
    id: { type: String, required: true },
    type: { type: String, enum: ['content', 'quiz'], required: true },
    title: { type: String },
    detail: { type: String, maxLength: 5000, default: "" } 
  }]
});

const Course = mongoose.model('Course', CourseSchema, 'courses'); 
export default Course;
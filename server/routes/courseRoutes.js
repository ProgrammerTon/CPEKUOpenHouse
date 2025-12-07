import express from 'express';
import Course from '../models/Course.js'; 

const router = express.Router();

// GET /api/courses
// ดึง Documents ทั้งหมดจาก Collection 'courses'
router.get('/', async (req, res) => {
    try {
        // ใช้ Course.find() เพื่อดึงข้อมูลทั้งหมด
        const courses = await Course.find({});
        res.status(200).json(courses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/courses
// สร้าง Document ใหม่ใน Collection 'courses'
router.post('/', async (req, res) => {
    const { name, description } = req.body; 
    
    if (!name) {
        return res.status(400).json({ message: 'Course name is required.' });
    }

    const newCourse = new Course({ name, description });

    try {
        const savedCourse = await newCourse.save();
        res.status(201).json(savedCourse);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

export default router;
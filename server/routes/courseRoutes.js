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


router.post('/', async (req, res) => {

    //console.log("ข้อมูลที่ได้รับจาก Frontend:", req.body); 
    const { name, description, category, sections } = req.body; 
    const newCourse = new Course({ 
        name, 
        description, 
        category, 
        sections  
    });

    try {
        const savedCourse = await newCourse.save();
        res.status(201).json(savedCourse);
    } catch (err) {
        console.error("❌ บันทึกไม่สำเร็จ:", err);
        res.status(400).json({ message: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        res.json(course);
    } catch (err) {
        res.status(404).json({ message: "ไม่พบคอร์สที่ระบุ" });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const updatedCourse = await Course.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true } 
        );
        res.json(updatedCourse);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/:id', async (req, res) => {
  try {
    const deletedCourse = await Course.findByIdAndDelete(req.params.id);
    if (!deletedCourse) return res.status(404).json({ message: "ไม่พบข้อมูล" });
    res.json({ message: "ลบสำเร็จ" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
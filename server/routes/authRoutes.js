import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcrypt';
const router = express.Router();

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(401).json({ message: "ข้อมูลไม่ถูกต้อง" });

        // เปรียบเทียบรหัสที่รับมา กับรหัสที่เป็น Hash ในฐานข้อมูล
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            res.json({ success: true, token: "secret-token-123" });
        } else {
            res.status(401).json({ message: "ข้อมูลไม่ถูกต้อง" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // สร้าง Salt และทำการ Hash รหัสผ่าน (เลข 10 คือความละเอียดในการเข้ารหัส)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newAdmin = new User({ 
            username, 
            password: hashedPassword // บันทึกตัวที่ Hash แล้วลง MongoDB
        });
        
        await newAdmin.save();
        res.status(201).json({ message: "สร้างแอดมินสำเร็จ" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

export default router;
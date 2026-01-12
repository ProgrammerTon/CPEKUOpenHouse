import express from 'express';
import User from '../models/User.js';
const router = express.Router();

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (user && user.password === password) { 
            res.json({ success: true, token: "secret-token-123" });
        } else {
            res.status(401).json({ message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const newAdmin = new User({ username, password });
        await newAdmin.save();
        res.status(201).json({ message: "สร้างแอดมินสำเร็จ!" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

export default router;
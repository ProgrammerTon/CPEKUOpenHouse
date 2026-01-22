import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const router = express.Router();

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (user && await bcrypt.compare(password, user.password)) {
            // สร้าง JWT Token
            const token = jwt.sign(
                { userId: user._id, username: user.username },
                process.env.JWT_SECRET, 
                { expiresIn: '1d' } // ระยะเวลา token
            );
            res.json({ success: true, token });
        } else {
            res.status(401).json({ message: "รหัสผ่านไม่ถูกต้อง" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// เลิก comment โค้ดส่วนนี้ เมื่อต้องการเพิ่ม admin ในระบบ
// router.post('/register', async (req, res) => {
//     try {
//         const { username, password } = req.body;
        
//         // สร้าง Salt และทำการ Hash รหัสผ่าน (เลข 10 คือความละเอียดในการเข้ารหัส)
//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(password, salt);

//         const newAdmin = new User({ 
//             username, 
//             password: hashedPassword // บันทึกตัวที่ Hash แล้วลง MongoDB
//         });
        
//         await newAdmin.save();
//         res.status(201).json({ message: "สร้างแอดมินสำเร็จ" });
//     } catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// });

export default router;
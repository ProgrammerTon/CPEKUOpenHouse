import jwt from 'jsonwebtoken';

export const verifyAdmin = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "เข้าถึงไม่ได้: กรุณาเข้าสู่ระบบ" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Token ไม่ถูกต้องหรือหมดอายุ" });
        }
        
        // ถ้าผ่าน ให้เก็บข้อมูล User ไว้ใน req เพื่อให้ Route อื่นๆ เรียกใช้ได้
        req.user = decoded; 
        next(); // อนุญาตให้ไปต่อที่ฟังก์ชันถัดไป
    });
};
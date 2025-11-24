import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import * as dotenv from 'dotenv'; 

import itemRoutes from './routes/itemRoutes.js'; 

// โหลดตัวแปรจาก .env
dotenv.config();

// กำหนดพอร์ต
const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL;

// ตั้งค่า Express App
const app = express();

// Middleware 
app.use(cors());
app.use(express.json());

// เชื่อมต่อฐานข้อมูล MongoDB
mongoose.connect(MONGO_URL)
    .then(() => console.log('✅ MongoDB Connected successfully!'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));


// กำหนด Routing
app.get('/', (req, res) => {
    res.send('Server is running! API is available at /api/items');
});

// กำหนดเส้นทางสำหรับ Item APIs
app.use('/api/items', itemRoutes);


// เริ่มต้น Server
app.listen(PORT, () => {
    console.log(`🚀 Server listening on port ${PORT}`);
});
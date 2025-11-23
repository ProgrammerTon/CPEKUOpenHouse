const express = require('express');
const cors = require('cors');
const multer = require('multer');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Connect Database
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// Setup Multer (upload folder)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'server/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Upload API
app.post('/api/upload', upload.single('file'), (req, res) => {
  res.json({ message: 'Uploaded!', filePath: req.file.path });
});

// Start Server
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});

app.get('/', (req, res) => {
  res.send("Server is running OK.");
});

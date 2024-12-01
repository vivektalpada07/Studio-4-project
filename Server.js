const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = 8080;

// Set storage engine for multer
const storage = multer.diskStorage({
  destination: path.join(__dirname, 'public/images'),
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Serve static files
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Endpoint to upload images
app.post('/upload', upload.array('images', 10), (req, res) => {
  const fileUrls = req.files.map(file => `/images/${file.filename}`);
  res.status(200).json({ message: 'Images uploaded successfully', fileUrls });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

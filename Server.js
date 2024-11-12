const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the React app's build directory
app.use(express.static(path.join(__dirname, 'build')));

// API routes (optional)
// app.get('/api/endpoint', (req, res) => {
//   res.json({ message: 'Hello from the server!' });
// });

// Catch-all handler to serve the React app for any route that isn’t an API route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Use the port provided by Render via the `PORT` environment variable
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

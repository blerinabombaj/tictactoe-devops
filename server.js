const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3333;

// Serve all static files (html, css, js, audio, images)
app.use(express.static(path.join(__dirname)));

// Handle root route - serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🎮 Tic-Tac-Toe server running at http://localhost:${PORT}`);
});

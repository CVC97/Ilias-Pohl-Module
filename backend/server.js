const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const usersRouter = require('./routes/users');
const progressRouter = require('./routes/progress');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/users', usersRouter);
app.use('/api/progress', progressRouter);

// Serve the bridge page at /bridge for local development.
app.get('/bridge', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'ilias_bridge.html'));
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
  console.log(`Bridge page: http://localhost:${PORT}/bridge`);
});

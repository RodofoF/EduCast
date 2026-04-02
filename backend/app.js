const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());

app.use('/api/auth', require('./src/routes/auth.routes'));

// Routes
app.use('/api/users', require('./src/routes/user.routes'));
app.use('/api/content', require('./src/routes/content.routes'));
app.use('/api/ondemand', require('./src/routes/ondemand.routes'));


app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

module.exports = app;
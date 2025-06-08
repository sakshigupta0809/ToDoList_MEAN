const express = require('express');
const cors = require('cors');  // Import cors
const app = express();

const taskRoutes = require('./routes/taskRoutes');

app.use(cors());             // Enable CORS for all routes
app.use(express.json());     // To parse JSON body
app.use('/tasks', taskRoutes);

module.exports = app;

const db = require('../config/db');

// Get task by ID
exports.getTaskById = (req, res) => {
  const id = req.params.id;
  const sql = 'SELECT * FROM tasks WHERE id = ?';
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Task not found' });
    res.json(results[0]);
  });
};

// Get all tasks
exports.getAllTasks = (req, res) => {
  const sql = 'SELECT * FROM tasks';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// Create new task
exports.addTask = (req, res) => {
  const {
    title,
    assignedTo,
    status,
    dueDate,
    priority,
    comments,
    completed = false, // Default false
  } = req.body;

  console.log('Received addTask data:', req.body);

  const sql = `
    INSERT INTO tasks (title, assigned_to, status, due_date, priority, comments, completed)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  // MySQL BIT type expects Buffer or 0/1 integer, convert boolean to 0 or 1
  const completedValue = completed ? 1 : 0;

  const params = [title, assignedTo, status, dueDate, priority, comments, completedValue];

  console.log('SQL Params:', params);

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error('Add task error:', err);
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: result.insertId, ...req.body });
  });
};

// Update task by ID
exports.updateTaskById = (req, res) => {
  const id = req.params.id;
  const {
    title,
    assignedTo,
    status,
    dueDate,
    priority,
    comments,
    completed,
  } = req.body;

  // Convert boolean to 0 or 1
  const completedValue = completed ? 1 : 0;

  // First check if task exists
  const sqlCheck = 'SELECT * FROM tasks WHERE id = ?';
  db.query(sqlCheck, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Task not found' });

    // Update query
    const sqlUpdate = `
      UPDATE tasks
      SET title = ?, assigned_to = ?, status = ?, due_date = ?, priority = ?, comments = ?, completed = ?
      WHERE id = ?
    `;

    const params = [title, assignedTo, status, dueDate, priority, comments, completedValue, id];

    db.query(sqlUpdate, params, (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id, ...req.body });
    });
  });
};

// Delete task by ID
exports.deleteTask = (req, res) => {
  const id = req.params.id;

  const sqlCheck = 'SELECT * FROM tasks WHERE id = ?';
  db.query(sqlCheck, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Task not found' });

    db.query('DELETE FROM tasks WHERE id = ?', [id], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(204).send(); // No Content
    });
  });
};

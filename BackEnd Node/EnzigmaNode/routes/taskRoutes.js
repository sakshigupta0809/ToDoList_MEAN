const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

router.get('/', taskController.getAllTasks);
router.get('/:id', taskController.getTaskById);
router.post('/', taskController.addTask);       // This must be here
router.put('/:id', taskController.updateTaskById);
router.delete('/:id', taskController.deleteTask);

module.exports = router;

// index.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Import the Todo model
const Todo = require('./models/Todo');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/todoapp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected...'))
  .catch(err => console.log('Failed to connect to MongoDB', err));

// Add Todo
app.post('/todos', async (req, res) => {
    try {
        const newTodo = new Todo({
            todo: req.body.todo
        });
        await newTodo.save();
        res.status(200).json({ success: true, message: 'Todo added successfully' });
    } catch (error) {
        console.error('Error adding todo:', error);  // Log the error in the console
        res.status(500).json({ success: false, message: 'Failed to add todo', error: error.message });
    }
});

// Fetch all Todos
app.get('/todos', async (req, res) => {
    try {
        const todos = await Todo.find();
        res.status(200).json(todos);
    } catch (error) {
        console.error('Error fetching todos:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch todos', error: error.message });
    }
});

// Update Todo
app.put('/todos/:id', async (req, res) => {
    try {
        const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, { todo: req.body.todo }, { new: true });
        res.status(200).json({ success: true, message: 'Todo updated successfully', todo: updatedTodo });
    } catch (error) {
        console.error('Error updating todo:', error);
        res.status(500).json({ success: false, message: 'Failed to update todo', error: error.message });
    }
});

// Delete Todo
app.delete('/todos/:id', async (req, res) => {
    try {
        await Todo.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Todo deleted successfully' });
    } catch (error) {
        console.error('Error deleting todo:', error);
        res.status(500).json({ success: false, message: 'Failed to delete todo', error: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

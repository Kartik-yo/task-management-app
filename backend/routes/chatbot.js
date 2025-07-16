const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Task = require('../models/Task');
const router = express.Router();

// Authentication middleware
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Chatbot endpoint
router.post('/', auth, async (req, res) => {
  const { message } = req.body;
  const userId = req.userId;

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `
    You are a task management assistant. The user says: "${message}". 
    Based on this, perform one of the following actions:
    - If the user wants to add a task (e.g., "Add task: Buy groceries"), create a task with the title after "Add task:".
    - If the user says "List tasks", return a list of their tasks.
    - If the user says something else, respond conversationally with a helpful message.
    User ID: ${userId}.
  `;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    if (message.toLowerCase().startsWith('add task:')) {
      const title = message.slice(9).trim();
      const task = new Task({ title, userId });
      await task.save();
      res.json({ message: `Task "${title}" added successfully!` });
    } else if (message.toLowerCase() === 'list tasks') {
      const tasks = await Task.find({ userId });
      const taskList = tasks.map(task => task.title).join(', ');
      res.json({ message: taskList || 'No tasks found.' });
    } else {
      res.json({ message: responseText });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error processing chatbot request' });
  }
});

module.exports = router;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/tasks', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setTasks(res.data);
      } catch (err) {
        alert('Error fetching tasks');
        navigate('/');
      }
    };
    fetchTasks();
  }, [navigate]);

  const addTask = async () => {
    if (!title.trim()) return;
    try {
      const res = await axios.post(
        'http://localhost:5000/api/tasks',
        { title },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setTasks([...tasks, res.data]);
      setTitle('');
    } catch (err) {
      alert('Error adding task');
    }
  };

  const updateTask = async (id, updates) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/tasks/${id}`,
        updates,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setTasks(tasks.map(task => (task._id === id ? res.data : task)));
    } catch (err) {
      alert('Error updating task');
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setTasks(tasks.filter(task => task._id !== id));
    } catch (err) {
      alert('Error deleting task');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">My Tasks</h2>
      <button className="btn btn-secondary mb-3" onClick={() => navigate('/chatbot')}>
        Go to Chatbot
      </button>
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Add a new task"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTask()}
        />
        <button className="btn btn-primary" onClick={addTask}>Add Task</button>
      </div>
      <ul className="list-group">
        {tasks.map(task => (
          <li key={task._id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <input
                type="checkbox"
                checked={task.status === 'completed'}
                onChange={() => updateTask(task._id, { status: task.status === 'completed' ? 'pending' : 'completed' })}
                className="me-2"
              />
              {task.title}
            </div>
            <button className="btn btn-danger btn-sm" onClick={() => deleteTask(task._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
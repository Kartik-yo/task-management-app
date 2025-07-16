import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import TaskList from './components/TaskList';
import Chatbot from './components/Chatbot';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/tasks" element={<TaskList />} />
        <Route path="/chatbot" element={<Chatbot />} />
      </Routes>
    </Router>
  );
}

export default App;
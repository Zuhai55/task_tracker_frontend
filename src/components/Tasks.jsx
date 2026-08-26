
import { useState, useEffect } from 'react';

function Tasks({ token }) {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  async function fetchTasks() {
    try {
      const response = await fetch('http://localhost:5000/tasks', {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      });
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      console.error('Failed to fetch tasks:', err.message);
    }
  }

  useEffect(function () {
    fetchTasks();
  }, []);

  async function handleCreateTask(event) {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ title, description })
      });

      if (!response.ok) {
        console.error('Failed to create task');
        return;
      }

      setTitle('');
      setDescription('');
      fetchTasks();
    } catch (err) {
      console.error('Something went wrong:', err.message);
    }
  }

  return (
    <div>
      <h2>Your Tasks</h2>

      <form onSubmit={handleCreateTask}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">Add Task</button>
      </form>

      <ul>
        {tasks.map(function (task) {
          return (
            <li key={task.id}>
              {task.title} — {task.description} - {task.status}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Tasks;
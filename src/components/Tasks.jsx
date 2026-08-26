import { useState, useEffect } from 'react';

function Tasks({ token }) {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editStatus, setEditStatus] = useState('pending');

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

  async function handleDeleteTask(taskId) {
    try {
      const response = await fetch('http://localhost:5000/tasks/' + taskId, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + token
        }
      });

      if (!response.ok) {
        console.error('Failed to delete task');
        return;
      }

      fetchTasks();
    } catch (err) {
      console.error('Something went wrong:', err.message);
    }
  }

  function handleStartEdit(task) {
    setEditingTaskId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setEditStatus(task.status);
  }

  function handleCancelEdit() {
    setEditingTaskId(null);
  }

  async function handleSaveEdit(taskId) {
    try {
      const response = await fetch('http://localhost:5000/tasks/' + taskId, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
          title: editTitle,
          description: editDescription,
          status: editStatus
        })
      });

      if (!response.ok) {
        console.error('Failed to update task');
        return;
      }

      setEditingTaskId(null);
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
          if (editingTaskId === task.id) {
            return (
              <li key={task.id}>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                <input
                  type="text"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                />
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
                <button onClick={() => handleSaveEdit(task.id)}>Save</button>
                <button onClick={handleCancelEdit}>Cancel</button>
              </li>
            );
          }

          return (
            <li key={task.id}>
              {task.title} — {task.description} - {task.status}
              <button onClick={() => handleStartEdit(task)}>Edit</button>
              <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Tasks;
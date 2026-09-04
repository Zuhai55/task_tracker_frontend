import { useState, useEffect } from 'react';
const API_URL = import.meta.env.VITE_API_URL;

function Tasks({ token }) {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editStatus, setEditStatus] = useState('pending');
  const [message, setMessage] = useState('');

  async function fetchTasks() {
    try {
      const response = await fetch(`${API_URL}/tasks`, {
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
    setMessage('');

    try {
      const response = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ title, description })
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || 'Failed to create task');
        return;
      }

      setTitle('');
      setDescription('');
      fetchTasks();
    } catch (err) {
      setMessage('Something went wrong: ' + err.message);
    }
  }

  async function handleDeleteTask(taskId) {
    setMessage('');

    try {
      const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + token
        }
      });

      if (!response.ok) {
        const data = await response.json();
        setMessage(data.error || 'Failed to delete task');
        return;
      }

      fetchTasks();
    } catch (err) {
      setMessage('Something went wrong: ' + err.message);
    }
  }

  function handleStartEdit(task) {
    setMessage('');
    setEditingTaskId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setEditStatus(task.status);
  }

  function handleCancelEdit() {
    setEditingTaskId(null);
    setMessage('');
  }

  function formatStatus(status) {
  if (status === 'in_progress') return 'In Progress';
  if (status === 'pending') return 'Pending';
  if (status === 'completed') return 'Completed';
  return status;
}

  async function handleSaveEdit(taskId) {
    if (!editTitle.trim()) {
      setMessage('Title is required');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/tasks/${taskId}`, {
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

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || 'Failed to update task');
        return;
      }

      setEditingTaskId(null);
      fetchTasks();
    } catch (err) {
      setMessage('Something went wrong: ' + err.message);
    }
  }

  return (
    <div id="tasks">
      <h2>Your Tasks</h2>

      {message && <p>{message}</p>}

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
        <button type="submit">+ Add Task</button>
      </form>
      <hr></hr>
      <ul>
        {tasks.map(function (task) {
          if (editingTaskId === task.id) {
            return (
              <li key={task.id}>
                <input id="edit_title"
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                <input
                  id="edit_description"
                  type="text"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                />
                <select
                  id="edit_status"
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
              <div id="task_title">{task.title}</div><div id="task_description">{task.description}</div><div id="task_status">{formatStatus(task.status)}</div>
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
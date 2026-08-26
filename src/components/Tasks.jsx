import { useState, useEffect, useMemo } from 'react';

/* Previous task list implementation, retained temporarily as a reference.

function LegacyTasks({ token }) {
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

*/
function Tasks({ token, onLogin }) {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('newest');

  async function fetchTasks() {
    if (!token) { setTasks([]); return; }
    try { const response = await fetch('http://localhost:5000/tasks', { headers: { Authorization: `Bearer ${token}` } }); if (response.ok) setTasks(await response.json()); }
    catch (err) { console.error('Failed to fetch tasks:', err.message); }
  }
  useEffect(() => {
    if (!token) return undefined;
    let cancelled = false;
    async function loadTasks() {
      try {
        const response = await fetch('http://localhost:5000/tasks', { headers: { Authorization: `Bearer ${token}` } });
        if (response.ok && !cancelled) setTasks(await response.json());
      } catch (err) { console.error('Failed to fetch tasks:', err.message); }
    }
    loadTasks();
    return () => { cancelled = true; };
  }, [token]);
  async function handleCreateTask(event) {
    event.preventDefault(); if (!token) { onLogin(); return; }
    try { const response = await fetch('http://localhost:5000/tasks', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ title, description }) }); if (!response.ok) return; setTitle(''); setDescription(''); setShowForm(false); fetchTasks(); }
    catch (err) { console.error('Something went wrong:', err.message); }
  }
  const displayedTasks = useMemo(() => tasks.filter((task) => statusFilter === 'All' || task.status === statusFilter).sort((a, b) => sortOrder === 'newest' ? Number(b.id) - Number(a.id) : Number(a.id) - Number(b.id)), [tasks, statusFilter, sortOrder]);
  const handleAddTask = () => { if (!token) onLogin(); else setShowForm((visible) => !visible); };

  return <section className="task-dashboard">
    <div className="dashboard-toolbar"><button className="outline-button add-button" onClick={handleAddTask}>Add Task +</button><button className="outline-button archive-button">Archived</button></div>
    {showForm && <form className="task-form" onSubmit={handleCreateTask}><label>Task name<input required value={title} onChange={(event) => setTitle(event.target.value)} /></label><label>Description<input value={description} onChange={(event) => setDescription(event.target.value)} /></label><button className="outline-button" type="submit">Save task</button></form>}
    <div className="filters"><label>Category:<select defaultValue="All"><option>All</option></select></label><div><span>Status:</span>{['To do', 'In Progress', 'Done', 'All'].map((status) => <button key={status} className={statusFilter === status ? 'selected' : ''} onClick={() => setStatusFilter(status)}>{status}</button>)}</div><div><span>Date Added:</span><button className={sortOrder === 'newest' ? 'selected' : ''} onClick={() => setSortOrder('newest')}>Newest</button><button className={sortOrder === 'oldest' ? 'selected' : ''} onClick={() => setSortOrder('oldest')}>Oldest</button></div><button className="clear-button" onClick={() => { setStatusFilter('All'); setSortOrder('newest'); }}>× Clear</button></div>
    <div className="task-table" role="table"><div className="task-row task-heading" role="row"><span className="drag-handle">⠿</span><span>Task Name</span><span>• Status</span><span>• Category</span><span>Archive</span></div>{displayedTasks.map((task) => <div className="task-row" role="row" key={task.id}><span></span><span>{task.title}<small>{task.description}</small></span><span>{task.status || 'To do'}</span><span>{task.category || '—'}</span><span><button className="text-button">Archive</button></span></div>)}</div>
  </section>;
}

export default Tasks;

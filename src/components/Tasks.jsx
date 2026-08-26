import { useState, useEffect, useMemo, useCallback, useRef } from 'react';

const STATUS_OPTIONS = ['To do', 'In Progress', 'Done', 'All'];

function Tasks({ token, onLogin }) {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('newest');
  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const [dragOverTaskId, setDragOverTaskId] = useState(null);
  const draggedElementRef = useRef(null);
  const dragStartYRef = useRef(0);

  async function fetchTasks() {
    if (!token) {
      setTasks([]);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/tasks', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        setTasks(await response.json());
      }
    } catch (err) {
      console.error('Failed to fetch tasks:', err.message);
    }
  }

  useEffect(() => {
    if (!token) return undefined;

    let cancelled = false;

    async function loadTasks() {
      try {
        const response = await fetch('http://localhost:5000/tasks', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.ok && !cancelled) {
          setTasks(await response.json());
        }
      } catch (err) {
        console.error('Failed to fetch tasks:', err.message);
      }
    }

    loadTasks();

    return () => {
      cancelled = true;
    };
  }, [token]);

  async function handleCreateTask(event) {
    event.preventDefault();

    if (!token) {
      onLogin();
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title, description })
      });

      if (!response.ok) return;

      setTitle('');
      setDescription('');
      setShowForm(false);
      fetchTasks();
    } catch (err) {
      console.error('Something went wrong:', err.message);
    }
  }

  const displayedTasks = useMemo(() => {
    const filtered = tasks.filter(
      (task) => statusFilter === 'All' || task.status === statusFilter
    );

    if (sortOrder === 'newest') {
      return filtered.sort((a, b) => Number(b.id) - Number(a.id));
    }

    if (sortOrder === 'oldest') {
      return filtered.sort((a, b) => Number(a.id) - Number(b.id));
    }

    return filtered;
  }, [tasks, statusFilter, sortOrder]);

  const handleDrop = useCallback((targetTaskId, sourceTaskId) => {
    if (sourceTaskId === null || sourceTaskId === targetTaskId) return;

    setTasks((currentTasks) => {
      const draggedTask = currentTasks.find(
        (task) => String(task.id) === sourceTaskId
      );
      const remainingTasks = currentTasks.filter(
        (task) => String(task.id) !== sourceTaskId
      );
      const targetIndex = remainingTasks.findIndex(
        (task) => String(task.id) === targetTaskId
      );

      if (!draggedTask || targetIndex < 0) return currentTasks;

      remainingTasks.splice(targetIndex, 0, draggedTask);
      return remainingTasks;
    });

    setSortOrder('manual');
    setDraggedTaskId(null);
    setDragOverTaskId(null);
  }, []);

  function handleDragStart(event, taskId) {
    event.preventDefault();
    dragStartYRef.current = event.clientY;
    draggedElementRef.current = event.currentTarget.closest('.task-row');
    setDraggedTaskId(String(taskId));
  }

  useEffect(() => {
    if (draggedTaskId === null) return undefined;

    function handlePointerMove(event) {
      if (draggedElementRef.current) {
        const deltaY = event.clientY - dragStartYRef.current;
        draggedElementRef.current.style.transform = `translateY(${deltaY}px)`;
      }

      const element = document.elementFromPoint(event.clientX, event.clientY);
      const target = element?.closest('[data-task-id]');
      setDragOverTaskId(target?.dataset.taskId || null);
    }

    function handlePointerUp() {
      if (draggedElementRef.current) {
        draggedElementRef.current.style.transform = '';
        draggedElementRef.current = null;
      }

      if (dragOverTaskId !== null) {
        handleDrop(dragOverTaskId, draggedTaskId);
      } else {
        setDraggedTaskId(null);
        setDragOverTaskId(null);
      }
    }

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [draggedTaskId, dragOverTaskId, handleDrop]);

  function handleAddTask() {
    if (!token) {
      onLogin();
    } else {
      setShowForm((visible) => !visible);
    }
  }

  function handleClearFilters() {
    setStatusFilter('All');
    setSortOrder('newest');
  }

  return (
    <section className="task-dashboard">
      <div className="dashboard-toolbar">
        <button className="outline-button add-button" onClick={handleAddTask}>
          Add Task +
        </button>
        <button className="outline-button archive-button">Archived</button>
      </div>

      {showForm && (
        <form className="task-form" onSubmit={handleCreateTask}>
          <label>
            Task name
            <input
              required
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </label>
          <label>
            Description
            <input
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </label>
          <button className="outline-button" type="submit">
            Save task
          </button>
        </form>
      )}

      <div className="filters">
        <label>
          Category:
          <select defaultValue="All">
            <option>All</option>
          </select>
        </label>

        <div>
          <span>Status:</span>
          {STATUS_OPTIONS.map((status) => (
            <button
              key={status}
              className={statusFilter === status ? 'selected' : ''}
              onClick={() => setStatusFilter(status)}
            >
              {status}
            </button>
          ))}
        </div>

        <div>
          <span>Date Added:</span>
          <button
            className={sortOrder === 'newest' ? 'selected' : ''}
            onClick={() => setSortOrder('newest')}
          >
            Newest
          </button>
          <button
            className={sortOrder === 'oldest' ? 'selected' : ''}
            onClick={() => setSortOrder('oldest')}
          >
            Oldest
          </button>
        </div>

        <button className="clear-button" onClick={handleClearFilters}>
          × Clear
        </button>
      </div>

      <div className="task-table" role="table">
        <div className="task-row task-heading" role="row">
          <span className="drag-handle">⠿</span>
          <span>Task Name</span>
          <span>• Status</span>
          <span>• Category</span>
          <span>Archive</span>
        </div>

        {displayedTasks.length === 0
          ? Array.from({ length: 4 }, (_, index) => (
              <div
                className="task-row task-placeholder"
                role="row"
                aria-hidden="true"
                key={`placeholder-${index}`}
              >
                <span className="drag-handle">⠿</span>
                <span>Task Name</span>
                <span>• Status</span>
                <span>• Category</span>
                <span>Archive</span>
              </div>
            ))
          : displayedTasks.map((task) => (
              <div
                className={[
                  'task-row',
                  dragOverTaskId === String(task.id) ? 'drag-over' : '',
                  draggedTaskId === String(task.id) ? 'dragging' : ''
                ]
                  .filter(Boolean)
                  .join(' ')}
                role="row"
                data-task-id={task.id}
                key={task.id}
              >
                <span
                  className="drag-handle"
                  onPointerDown={(event) => handleDragStart(event, task.id)}
                >
                  ⠿
                </span>
                <span>
                  {task.title}
                  <small>{task.description}</small>
                </span>
                <span>{task.status || 'To do'}</span>
                <span>{task.category || '—'}</span>
                <span>
                  <button className="text-button">Archive</button>
                </span>
              </div>
            ))}
      </div>
    </section>
  );
}

export default Tasks;
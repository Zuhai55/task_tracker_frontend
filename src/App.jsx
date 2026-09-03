import { useState, useEffect } from 'react';
import Signup from './components/Signup';
import Login from './components/Login';
import Tasks from './components/Tasks';
import './App.css';

function App() {
  const [token, setToken] = useState(function () {
    return localStorage.getItem('token');
  });

  useEffect(function () {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  function handleLoginSuccess(newToken) {
    setToken(newToken);
  }

  function handleLogout() {
    setToken(null);
  }

  let content;
  if (token) {
    return (
    <div>
      <header>
        <h1 id="task_title">Task Tracker</h1>
        <button onClick={handleLogout}>Log out</button>
      </header>
      <div id="tasks">
        <Tasks token={token} />
      </div>
    </div>
  );
  } else {
    return (
    <div>
      <header>
        <h1>Task Tracker</h1>
      </header>
      <div className="account-forms">
        <Signup />
        <Login onLoginSuccess={handleLoginSuccess} />
      </div>
    </div>
  );
  }

  return (
    <div>
      <header>
        <h1>Task Tracker</h1>
      </header>
      {content}
    </div>
  );
}

export default App;
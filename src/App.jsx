import { useState, useEffect } from 'react';
import Signup from './components/Signup';
import Login from './components/Login';
import Tasks from './components/Tasks';

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
    content = (
      <div>
        <button onClick={handleLogout}>Log out</button>
        <Tasks token={token} />
      </div>
    );
  } else {
    content = (
      <div>
        <Signup />
        <Login onLoginSuccess={handleLoginSuccess} />
      </div>
    );
  }

  return (
    <div>
      <h1>Task Tracker</h1>
      {content}
    </div>
  );
}

export default App;
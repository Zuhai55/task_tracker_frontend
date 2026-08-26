import { useState } from 'react';
import Signup from './components/Signup';
import Login from './components/Login';
import Tasks from './components/Tasks';

function App() {
  const [token, setToken] = useState(null);

  function handleLoginSuccess(newToken) {
    setToken(newToken);
  }

  let content;
  if (token) {
    content = <Tasks token={token} />;
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
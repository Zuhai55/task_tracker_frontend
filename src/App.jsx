import { useState } from 'react';
import Signup from './components/Signup';
import Login from './components/Login';

function App() {
  const [token, setToken] = useState(null);

  function handleLoginSuccess(newToken) {
    setToken(newToken);
  }

  let content;
  if (token) {
    content = <p>You are logged in. Token: {token}</p>;
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
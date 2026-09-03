
import { useState } from 'react';
const API_URL = import.meta.env.VITE_API_URL;

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || 'Login failed');
        return;
      }

      setMessage('Login successful');
      onLoginSuccess(data.token);
    } catch (err) {
      setMessage('Something went wrong: ' + err.message);
    }
  }

  return (
    <div class="signup_login" id="login">
      <form onSubmit={handleSubmit}>
        <h2>Log in</h2>
        <div>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Log in</button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
}

export default Login;
import { useState } from 'react';

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/auth/login', {
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
    <form onSubmit={handleSubmit}>
      <h2>Log in</h2>
      <div>
        <label>Username</label>
        <input
          type="text"
          autoComplete="username"
          required
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
  );
}

export default Login;

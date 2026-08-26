import { useState } from 'react';

function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || 'Signup failed');
        return;
      }

      setMessage('Signup successful! User ID: ' + data.userId);
    } catch (err) {
      setMessage('Something went wrong: ' + err.message);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Sign up</h2>
      <div>
        <label>Username</label>
        <input
          type="text"
          autoComplete="username"
          minLength="3"
          pattern="[A-Za-z0-9_]+"
          title="Use at least 3 letters, numbers, or underscores."
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
      <button type="submit">Sign up</button>
      {message && <p>{message}</p>}
    </form>
  );
}

export default Signup;

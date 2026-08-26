import { useState } from 'react';
import Signup from './components/Signup';
import Login from './components/Login';
<<<<<<< HEAD
import Tasks from './components/Tasks';
import './App.css';
=======
>>>>>>> parent of 7fe6761 (added Tasks to frontend)

function App() {
  const [token, setToken] = useState(null);
  const [showAccount, setShowAccount] = useState(false);
  const [accountView, setAccountView] = useState('login');

  function openAccount(view) {
    setAccountView(view);
    setShowAccount(true);
  }

<<<<<<< HEAD
  function handleLogout() {
    setToken(null);
  }

  function closeAccount() {
    setShowAccount(false);
=======
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
>>>>>>> parent of 7fe6761 (added Tasks to frontend)
  }

  return (
    <main className="app-shell">
      <header className="site-header">
        <h1>Hairi's Task Tracker</h1>
        {token ? (
          <button className="outline-button" onClick={handleLogout}>
            Log out
          </button>
        ) : (
          <button className="outline-button" onClick={() => openAccount('login')}>
            Login
          </button>
        )}
      </header>

      <Tasks token={token} onLogin={() => openAccount('login')} />

      {showAccount && (
        <div className="dialog-backdrop" role="presentation" onClick={closeAccount}>
          <section
            className="account-dialog"
            role="dialog"
            aria-modal="true"
            aria-label="Account access"
            onClick={(event) => event.stopPropagation()}
          >
            <button className="dialog-close" aria-label="Close" onClick={closeAccount}>
              ×
            </button>

            <div className="account-tabs">
              <button
                className={accountView === 'login' ? 'active' : ''}
                onClick={() => setAccountView('login')}
              >
                Login
              </button>
              <button
                className={accountView === 'signup' ? 'active' : ''}
                onClick={() => setAccountView('signup')}
              >
                Sign up
              </button>
            </div>

            {accountView === 'login' ? (
              <Login onLoginSuccess={setToken} />
            ) : (
              <Signup />
            )}
          </section>
        </div>
      )}
    </main>
  );
}

export default App;
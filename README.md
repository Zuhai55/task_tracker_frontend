# Task Tracker — Frontend

A React frontend for the Task Tracker API — lets users sign up, log in, and manage their tasks through a browser UI.

**Live site:** [Click Here]([url](https://thesaurus-wistful-abnormal.ngrok-free.dev/))
**Backend repo:** [Click Here](https://github.com/Zuhai55/task_tracker)

## Features

- Signup and login forms, connected to a JWT-authenticated backend
- Persistent login — session stored in `localStorage`, survives page refresh
- Full task management: create, view, edit, and delete tasks
- Responsive layout for mobile, tablet, and desktop screens

## Tech Stack

- **Library:** React
- **Build tool:** Vite
- **Styling:** Plain CSS (flexbox-based, custom, no framework)
- **Deployment:** Render (Static Site)

## Project Structure

```
task-tracker-frontend/
├── src/
│   ├── components/
│   │   ├── Signup.jsx
│   │   ├── Login.jsx
│   │   └── Tasks.jsx
│   ├── App.jsx
│   └── App.css
```

## What I Learned

Built this to learn React fundamentals — component state with `useState`, side effects and data fetching with `useEffect`, lifting state up and passing data between components via props, controlled form inputs, and connecting a frontend to a REST API with `fetch`, including handling auth tokens and CORS across two separately deployed services.

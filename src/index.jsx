// src/index.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css'; // Assuming your Tailwind setup is here or in App.jsx
import App from './App';
// 👇 1. Import AuthProvider (ensure the path and .jsx extension are correct)
import { AuthProvider } from './contexts/AuthContext.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		{/* 👇 2. Wrap the App component with AuthProvider */}
		<AuthProvider>
			<App />
		</AuthProvider>
	</React.StrictMode>
);
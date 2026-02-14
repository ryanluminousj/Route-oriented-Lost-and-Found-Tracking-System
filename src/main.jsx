import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

console.log('main.jsx: Starting application...');
console.log('Root element:', document.getElementById('root'));

try {
	ReactDOM.createRoot(document.getElementById('root')).render(
		<React.StrictMode>
			<App />
		</React.StrictMode>
	);
	console.log('main.jsx: App rendered successfully');
} catch (error) {
	console.error('main.jsx: Error rendering app:', error);
	document.body.innerHTML = `
		<div style="padding: 20px; background: #fee; color: #c00; font-family: sans-serif;">
			<h1>Application Error</h1>
			<pre>${error.message}\n\n${error.stack}</pre>
		</div>
	`;
}

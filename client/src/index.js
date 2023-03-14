import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import { AppProvider } from './context/appContext';

ReactDOM.render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
// import ReactDOM from 'react-dom/client';
// import reportWebVitals from './reportWebVitals';
// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <AppProvider>
//     <App />
//   </AppProvider>
// );
// reportWebVitals();

  // import ReactDOM from 'react-dom';

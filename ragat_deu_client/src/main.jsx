import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

import AuthContextProvider from './auth/AuthProvider';
import App from './App';
// import * as Lame from "lamejs"; // <-- REMOVE THIS
import './index.css';

const queryClient = new QueryClient();
const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

// window.Lame = Lame; // <-- REMOVE THIS

// Render the application.
root.render(
  <Router>
    <AuthContextProvider>
      <QueryClientProvider client={queryClient}>
        <App />
        <Toaster position="top-right" reverseOrder={false} />
      </QueryClientProvider>
    </AuthContextProvider>
  </Router>
);
import React from 'react';
import reportWebVitals from './reportWebVitals';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import BaseLayout from './BaseLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Events from './pages/Events';
import FindFacility from './pages/FindFacility';
import AboutUs from './pages/AboutUs';
import Education from './pages/Education';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import History from './pages/History';
import Rewards from './pages/Rewards';
import Admin from './pages/Admin';
import AdminLayout from './AdminLayout';
import Recycle from './pages/Recycle';
import { Toaster } from 'react-hot-toast';

const router = createBrowserRouter([
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        path: '',
        element: <Admin />
      }
    ]
  },
  {
    path: '/',
    element: <BaseLayout />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/login',
        element: <Login /> 
      },
      {
        path: '/recycle',
        element: <Recycle />
      },
      {
        path: '/signup',
        element: <Signup /> 
      },
      {
        path: '/events',
        element: <Events /> 
      },
      {
        path: '/find-facility',
        element: <FindFacility />
      },
      {
        path: '/about-us',
        element: <AboutUs />
      },
      {
        path: '/learn',
        element: <Education />
      },
      {
        path: '/dashboard',
        element: <Dashboard />
      },
      {
        path: '/profile',
        element: <Profile />
      },
      {
        path: '/history',
        element: <History /> 
      },
      {
        path: '/rewards',
        element: <Rewards /> 
      }
    ]
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
          },
          success: {
            style: {
              background: '#22c55e',
            },
          },
          error: {
            style: {
              background: '#ef4444',
            },
          },
        }}
      />
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();

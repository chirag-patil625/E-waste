import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider, Route } from 'react-router-dom';
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
import UpdateProfile from './pages/UpdateProfile';
import History from './pages/History';
import Rewards from './pages/Rewards';
import Admin from './pages/Admin';
import AdminLayout from './AdminLayout';
import Recycle from './pages/Recycle';

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
        path: '/update-profile',
        element: <UpdateProfile />
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
    <RouterProvider router={router}/>
  </React.StrictMode>
);

reportWebVitals();

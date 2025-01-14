import React from 'react'
import { Outlet } from 'react-router-dom'
import Footer from './components/Footer.jsx'
import Navbar from './components/Navbar'

export default function BaseLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
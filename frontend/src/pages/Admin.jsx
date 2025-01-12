import React, { useState } from 'react';
import { FaHome, FaRecycle, FaBook, FaCalendar, FaSignOutAlt } from 'react-icons/fa';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <FaHome /> },
    { id: 'requests', label: 'Recycle Requests', icon: <FaRecycle /> },
    { id: 'education', label: 'Education', icon: <FaBook /> },
    { id: 'events', label: 'Events', icon: <FaCalendar /> }
  ];

  const mockRequests = [
    { id: 1, userName: "John Doe", item: "Laptop", quantity: 1, status: "Pending" },
    { id: 2, userName: "Jane Smith", item: "Mobile", quantity: 2, status: "Pending" }
  ];

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-2xl font-bold">Admin Panel</h2>
        </div>
        <nav className="mt-4">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-6 py-3 text-left ${
                activeTab === item.id ? 'bg-blue-600' : 'hover:bg-gray-700'
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </button>
          ))}
          <button className="w-full flex items-center px-6 py-3 text-left text-red-400 hover:bg-gray-700 mt-auto">
            <FaSignOutAlt className="mr-3" />
            Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-gray-100">
        <header className="bg-white shadow-md p-4">
          <h1 className="text-2xl font-semibold text-gray-800">
            {sidebarItems.find(item => item.id === activeTab)?.label}
          </h1>
        </header>

        <main className="p-6">
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-4">Pending Requests</h3>
                <p className="text-3xl font-bold text-blue-600">12</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-4">Total Users</h3>
                <p className="text-3xl font-bold text-green-600">156</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-4">Total Recycled</h3>
                <p className="text-3xl font-bold text-purple-600">1,234 kg</p>
              </div>
            </div>
          )}

          {activeTab === 'requests' && (
            <div className="bg-white rounded-lg shadow-md">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Item
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {mockRequests.map((request) => (
                      <tr key={request.id}>
                        <td className="px-6 py-4 whitespace-nowrap">{request.userName}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{request.item}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{request.quantity}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            {request.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap space-x-2">
                          <input
                            type="number"
                            placeholder="Tokens"
                            className="w-20 px-2 py-1 border rounded"
                          />
                          <button className="bg-green-500 text-white px-3 py-1 rounded text-sm">
                            Approve
                          </button>
                          <button className="bg-red-500 text-white px-3 py-1 rounded text-sm">
                            Reject
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'education' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-4">Add New Content</h3>
                <form className="space-y-4">
                  <input
                    type="text"
                    placeholder="Title"
                    className="w-full p-2 border rounded"
                  />
                  <textarea
                    placeholder="Description"
                    className="w-full p-2 border rounded"
                    rows="4"
                  />
                  <select className="w-full p-2 border rounded">
                    <option>Basic</option>
                    <option>Advanced</option>
                    <option>Expert</option>
                  </select>
                  <input
                    type="file"
                    className="w-full p-2 border rounded"
                  />
                  <button className="bg-blue-600 text-white px-4 py-2 rounded">
                    Add Content
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'events' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Add New Event</h3>
              <form className="space-y-4">
                <input
                  type="text"
                  placeholder="Event Name"
                  className="w-full p-2 border rounded"
                />
                <input
                  type="date"
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Location"
                  className="w-full p-2 border rounded"
                />
                <textarea
                  placeholder="Description"
                  className="w-full p-2 border rounded"
                  rows="4"
                />
                <button className="bg-blue-600 text-white px-4 py-2 rounded">
                  Create Event
                </button>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

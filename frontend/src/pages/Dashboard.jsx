import React from 'react';

export default function Dashboard() {
  const stats = [
    { label: 'Total Points', value: '1,250', icon: '🏆' },
    { label: 'Items Recycled', value: '25', icon: '♻️' },
    { label: 'Carbon Saved', value: '125kg', icon: '🌱' },
    { label: 'Events Joined', value: '3', icon: '📅' }
  ];

  const recentActivities = [
    { date: '2024-02-15', activity: 'Recycled Electronics', points: 100 },
    { date: '2024-02-10', activity: 'Attended Workshop', points: 50 },
    { date: '2024-02-05', activity: 'Battery Disposal', points: 75 }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {recentActivities.map((activity, index) => (
            <div key={index} className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">{activity.activity}</p>
                <p className="text-sm text-gray-500">{activity.date}</p>
              </div>
              <span className="text-teal-600 font-medium">+{activity.points} pts</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

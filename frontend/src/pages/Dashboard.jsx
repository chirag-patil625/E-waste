import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { isLoggedIn, loading: authLoading } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    totalPoints: 0,
    itemsRecycled: 0,
    eventsJoined: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (isLoggedIn) {
        try {
          await Promise.all([
            fetchDashboardData(),
            fetchRecentActivities()
          ]);
        } catch (error) {
          console.error('Error fetching dashboard data:', error);
          toast.error('Failed to load dashboard');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [isLoggedIn]);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('userToken')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const data = await response.json();
      setDashboardData(data.stats);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      toast.error('Failed to load dashboard stats');
    }
  };

  const fetchRecentActivities = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/history', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('userToken')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch activities');
      }

      const data = await response.json();
      setRecentActivities(data.slice(0, 5)); // Only show last 5 activities
    } catch (error) {
      console.error('Error fetching activities:', error);
      toast.error('Failed to load recent activities');
    }
  };

  const stats = [
    { 
      label: 'Total Points', 
      value: dashboardData.totalPoints || 0, 
      icon: '🏆' 
    },
    { 
      label: 'Items Recycled', 
      value: dashboardData.itemsRecycled || 0, 
      icon: '♻️' 
    },
    { 
      label: 'Events Joined', 
      value: dashboardData.eventsJoined || 0, 
      icon: '📅' 
    }
  ];

  // Show loading state while checking auth
  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-lg text-gray-600">Loading...</div>
    </div>;
  }

  // Redirect if not logged in
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-teal-500 to-emerald-500 rounded-2xl p-8 mb-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome to Your Dashboard</h1>
        <p className="text-teal-100">Track your recycling progress and upcoming events</p>
      </div>

      <div className="grid gap-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl">{stat.icon}</span>
                <span className="text-3xl font-bold text-gray-800">{stat.value}</span>
              </div>
              <h3 className="text-gray-600 font-medium">{stat.label}</h3>
            </div>
          ))}
        </div>

        {/* Recent Activity Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="border-b border-gray-100">
            <div className="px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Recent Activity</h2>
              <Link 
                to="/history" 
                className="text-teal-600 hover:text-teal-700 text-sm font-medium"
              >
                View All →
              </Link>
            </div>
          </div>
          
          <div className="divide-y divide-gray-100">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity, index) => (
                <div 
                  key={index} 
                  className="p-6 hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">
                        {activity.deviceType}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {new Date(activity.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        activity.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : activity.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {activity.status}
                      </span>
                      {activity.tokens && (
                        <span className="flex items-center text-teal-600 font-semibold">
                          <span className="text-lg mr-1">+</span>
                          {activity.tokens}
                          <span className="text-sm ml-1">pts</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                <div className="text-4xl mb-4">📝</div>
                <p className="font-medium">No recent activities</p>
                <p className="text-sm mt-2">Start recycling to see your activities here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

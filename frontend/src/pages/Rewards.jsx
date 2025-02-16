import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Rewards() {
  const { isLoggedIn } = useAuth();
  const [userStats, setUserStats] = useState({
    totalPoints: 0,
    itemsRecycled: 0,
    rewardsClaimed: 0
  });
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [selectedReward, setSelectedReward] = useState(null);
  const [redeemForm, setRedeemForm] = useState({
    address: '',
    phone: '',
    notes: ''
  });
  const [claimedRewards, setClaimedRewards] = useState([]);
  const [showClaimedRewards, setShowClaimedRewards] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      fetchUserStats();
      fetchRewards();
      fetchClaimedRewards();
    }
  }, [isLoggedIn]);

  const fetchUserStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('userToken')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      
      // Update userStats with the new points calculation
      setUserStats({
        totalPoints: data.stats.totalPoints || 0,
        itemsRecycled: data.stats.itemsRecycled || 0,
        rewardsClaimed: data.stats.rewardsClaimed || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to load user stats');
    }
  };

  const fetchRewards = async () => {
    try {
      console.log('Fetching rewards...');
      const response = await fetch('http://localhost:5000/api/rewards', {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('userToken')}`
        }
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch rewards');
      }
      
      const data = await response.json();
      console.log('Rewards fetched:', data);
      setRewards(data);
    } catch (error) {
      console.error('Fetch rewards error:', error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchClaimedRewards = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/rewards/my-requests', {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('userToken')}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch claimed rewards');
      }

      const data = await response.json();
      console.log('Claimed rewards:', data);
      setClaimedRewards(data);
    } catch (error) {
      console.error('Fetch claimed rewards error:', error);
      toast.error(error.message);
    }
  };

  const handleRedeemReward = async (rewardId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/rewards/redeem/${rewardId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('userToken')}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to redeem reward');
      
      const data = await response.json();
      toast.success('Reward redeemed successfully!');
      
      // Update user stats after redemption
      setUserStats(prev => ({
        ...prev,
        totalPoints: data.remainingPoints,
        rewardsClaimed: prev.rewardsClaimed + 1
      }));
      
    } catch (error) {
      toast.error(error.message || 'Failed to redeem reward');
    }
  };

  const RedeemModal = () => {
    const [formData, setFormData] = useState({
      address: '',
      phone: '',
      notes: ''
    });

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await fetch(`http://localhost:5000/api/rewards/redeem/${selectedReward._id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('userToken')}`
          },
          body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (!response.ok) {
          if (data.error === 'Insufficient points') {
            throw new Error(`Insufficient points. You need ${data.required} points but have ${data.available} points.`);
          }
          throw new Error(data.error || 'Failed to redeem reward');
        }

        toast.success('Reward redeemed successfully!');
        setShowRedeemModal(false);
        setSelectedReward(null);
        
        // Update the points immediately after redemption
        setUserStats(prev => ({
          ...prev,
          totalPoints: data.remainingPoints,
          rewardsClaimed: prev.rewardsClaimed + 1
        }));

        // Refresh claimed rewards
        await fetchClaimedRewards();
      } catch (error) {
        console.error('Error:', error);
        toast.error(error.message);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <h2 className="text-2xl font-bold mb-4">Redeem {selectedReward?.name}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Delivery Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                autoComplete="off"
                rows="3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Additional Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="2"
              />
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                type="button"
                onClick={() => setShowRedeemModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Confirm Redemption
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const ClaimedRewardsList = () => (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Claimed Rewards</h2>
      <div className="grid grid-cols-1 gap-4">
        {claimedRewards.map(request => (
          <div key={request._id} className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{request.rewardName}</h3>
                <p className="text-sm text-gray-600">
                  Claimed on: {new Date(request.createdAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">Status: 
                  <span className={`ml-1 ${
                    request.status === 'approved' ? 'text-green-600' :
                    request.status === 'rejected' ? 'text-red-600' :
                    'text-yellow-600'
                  }`}>
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-600">
                  Points spent: {request.pointsCost}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const handleRedeemClick = (reward) => {
    if (userStats.totalPoints >= reward.pointsCost) {
      setSelectedReward(reward);
      setShowRedeemModal(true);
    }
  };

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  // Fix loading screen JSX
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading rewards...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      {/* Points Overview */}
      <div className="container mx-auto px-4 mb-12">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-teal-500 to-emerald-500 rounded-2xl p-8 text-white">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2">Your Reward Points</h2>
            <div className="text-5xl font-bold mb-4">{userStats.totalPoints}</div>
            <p className="text-teal-100">Keep recycling to earn more points!</p>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-2xl font-bold">{userStats.itemsRecycled}</div>
              <div className="text-sm text-teal-100">Items Recycled</div>
            </div>
            <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-2xl font-bold">{userStats.rewardsClaimed}</div>
              <div className="text-sm text-teal-100">Rewards Claimed</div>
            </div>
            <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-2xl font-bold">
                {userStats.totalPoints >= 1500 ? 'Gold' : 
                 userStats.totalPoints >= 750 ? 'Silver' : 'Bronze'}
              </div>
              <div className="text-sm text-teal-100">Member Status</div>
            </div>
          </div>
        </div>
      </div>

      {/* Available Rewards */}
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            {showClaimedRewards ? 'Claimed Rewards' : 'Available Rewards'}
          </h2>
          <button
            onClick={() => setShowClaimedRewards(!showClaimedRewards)}
            className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 transition-colors"
          >
            {showClaimedRewards ? 'Show Available Rewards' : 'Show My Claims'}
          </button>
        </div>

        {showClaimedRewards ? (
          <ClaimedRewardsList />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {rewards.map(reward => (
              <div key={reward._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={reward.imageUrl} 
                    alt={reward.name}
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-800">{reward.name}</h3>
                    <span className="px-3 py-1 bg-teal-100 text-teal-600 rounded-full text-sm font-medium">
                      {reward.pointsCost} pts
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{reward.description}</p>
                  {claimedRewards.some(claim => claim.rewardId._id === reward._id) ? (
                    <button
                      disabled
                      className="w-full py-2 rounded-lg bg-gray-100 text-gray-400 cursor-not-allowed"
                    >
                      Already Redeemed
                    </button>
                  ) : (
                    <button
                      onClick={() => handleRedeemClick(reward)}
                      disabled={userStats.totalPoints < reward.pointsCost}
                      className={`w-full py-2 rounded-lg transition-colors duration-200 ${
                        userStats.totalPoints >= reward.pointsCost
                          ? 'bg-teal-500 text-white hover:bg-teal-600'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {userStats.totalPoints >= reward.pointsCost ? 'Redeem Now' : 'Not Enough Points'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* How to Earn Points */}
        <div className="max-w-4xl mx-auto mt-16 p-8 bg-white rounded-xl shadow-md">
          <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">How to Earn Points</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">♻️</div>
              <h4 className="font-semibold text-gray-800 mb-2">Recycle E-Waste</h4>
              <p className="text-gray-600 text-sm">50 points per item recycled at our facilities</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">📅</div>
              <h4 className="font-semibold text-gray-800 mb-2">Attend Events</h4>
              <p className="text-gray-600 text-sm">100 points for each event attended</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">👥</div>
              <h4 className="font-semibold text-gray-800 mb-2">Refer Friends</h4>
              <p className="text-gray-600 text-sm">200 points for each successful referral</p>
            </div>
          </div>
        </div>
      </div>

      {showRedeemModal && <RedeemModal />}
    </div>
  );
}

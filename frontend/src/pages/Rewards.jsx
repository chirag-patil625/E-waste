import React from 'react';

export default function Rewards() {
  // This would come from backend in future
  const userPoints = 1250;
  const rewardItems = [
    {
      id: 1,
      name: "Eco-Friendly Water Bottle",
      points: 500,
      image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      description: "Stainless steel, reusable water bottle",
      available: true
    },
    {
      id: 2,
      name: "Shopping Voucher",
      points: 1000,
      image: "https://images.unsplash.com/photo-1556742111-a301076d9d18?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      description: "₹500 shopping voucher for eco-friendly stores",
      available: true
    },
    {
      id: 3,
      name: "Solar Power Bank",
      points: 1500,
      image: "https://images.unsplash.com/photo-1620813528266-ef4729a2e487?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      description: "10000mAh solar-powered power bank",
      available: true
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      {/* Points Overview */}
      <div className="container mx-auto px-4 mb-12">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-teal-500 to-emerald-500 rounded-2xl p-8 text-white">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2">Your Reward Points</h2>
            <div className="text-5xl font-bold mb-4">{userPoints}</div>
            <p className="text-teal-100">Keep recycling to earn more points!</p>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-2xl font-bold">25</div>
              <div className="text-sm text-teal-100">Items Recycled</div>
            </div>
            <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-2xl font-bold">3</div>
              <div className="text-sm text-teal-100">Rewards Claimed</div>
            </div>
            <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-2xl font-bold">Silver</div>
              <div className="text-sm text-teal-100">Member Status</div>
            </div>
          </div>
        </div>
      </div>

      {/* Available Rewards */}
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Available Rewards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {rewardItems.map(item => (
            <div key={item.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="h-48 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-800">{item.name}</h3>
                  <span className="px-3 py-1 bg-teal-100 text-teal-600 rounded-full text-sm font-medium">
                    {item.points} pts
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{item.description}</p>
                <button
                  className={`w-full py-2 rounded-lg transition-colors duration-200 ${
                    userPoints >= item.points
                      ? 'bg-teal-500 text-white hover:bg-teal-600'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                  disabled={userPoints < item.points}
                >
                  {userPoints >= item.points ? 'Redeem Now' : 'Not Enough Points'}
                </button>
              </div>
            </div>
          ))}
        </div>

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
    </div>
  );
}

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Dashboard } from '../components/Dashboard';
import { findMatches } from '../utils/matching';

export function DashboardPage({ user, logout, items, onUpdateItemStatus, onDeleteItem }) {
  const [routes, setRoutes] = useState([
    {
      id: '1',
      name: 'Ratnapark - Koteshwor',
      color: '#DC2626',
      stops: ['Ratnapark', 'New Baneshwor', 'Tinkune', 'Airport', 'Sinamangal', 'Koteshwor']
    },
    {
      id: '2',
      name: 'Kalanki - Budhanilkantha',
      color: '#059669',
      stops: ['Kalanki', 'Kalimati', 'Ratnapark', 'Maharajgunj', 'Chakrapath', 'Budhanilkantha']
    },
    {
      id: '3',
      name: 'Lagankhel - Swayambhu',
      color: '#2563EB',
      stops: ['Lagankhel', 'Jawalakhel', 'Thapathali', 'Kalimati', 'Swayambhu']
    },
    {
      id: '4',
      name: 'Balaju - Bhaktapur',
      color: '#7C3AED',
      stops: ['Balaju', 'Gongabu', 'Chabahil', 'Gaushala', 'Jadibuti', 'Bhaktapur']
    }
  ]);

  const matches = findMatches(items);

  let displayName = 'User';
  if (user && user.name) {
    displayName = user.name;
  }

  function handleLogout() {
    logout();
  }

  return (
    <div className="min-h-screen bg-green-50">
      <header className="bg-gradient-to-r from-blue-400/30 to-green-600/30 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link to="/" className="block">
                <h1 className="text-2xl font-bold text-sky-800 hover:text-sky-900 transition">
                  Route Tracker
                </h1>
                <p className="text-sm text-sky-600">Lost & Found Tracking System</p>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-emerald text-sm">
                Welcome, {displayName}
              </span>
              <Link to="/report" className="px-4 py-2 rounded-lg font-medium bg-green-500 text-white hover:bg-green-400 transition">
                Report Item
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Dashboard
          routes={routes}
          items={items}
          matches={matches}
          onViewRoute={() => {}}
          onUpdateItemStatus={onUpdateItemStatus}
          onDeleteItem={onDeleteItem}
        />
      </main>
    </div>
  );
}

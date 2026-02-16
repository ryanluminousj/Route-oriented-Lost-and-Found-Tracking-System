import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Login } from './components/Login';
import { Signup } from './components/Signup';
import { Dashboard } from './components/Dashboard';
import { ReportItem } from './components/ReportItem';
import { findMatches } from './utils/matching';

// Component that handles all routes after auth check
function AuthenticatedRoutes() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Shared state for items across pages
  const [items, setItems] = useState([
    {
      id: '1',
      routeId: '1',
      type: 'lost',
      category: 'Electronics',
      description: 'Samsung Galaxy phone with red cover',
      location: 'Tinkune',
      date: '2026-01-15',
      status: 'open',
      reportedBy: 'Raj Shrestha',
      contactEmail: 'raj.shrestha@email.com',
      imageUrl: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjBwaG9uZSUyMGNhc2V8ZW58MXx8fHwxNzY4NzMxNTA4fDA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: '2',
      routeId: '2',
      type: 'found',
      category: 'Personal Items',
      description: 'Black leather wallet with 5000 cash',
      location: 'Ratnapark',
      date: '2026-01-16',
      status: 'open',
      reportedBy: 'Driver #12',
      contactEmail: 'driver12@busoperator.com',
      imageUrl: 'https://images.unsplash.com/photo-1601592996763-f05c9c80a7f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWF0aGVyJTIwd2FsbGV0fGVufDF8fHx8MTc2ODY1NjI2MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: '3',
      routeId: '1',
      type: 'found',
      category: 'Electronics',
      description: 'Samsung smartphone with red protective case',
      location: 'Sinamangal',
      date: '2026-01-15',
      status: 'open',
      reportedBy: 'Station Supervisor',
      contactEmail: 'supervisor@station.com',
      imageUrl: 'https://images.unsplash.com/photo-1598346654072-1f3a493b62d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMHNtYXJ0cGhvbmV8ZW58MXx8fHwxNzY4NzMxNTA4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: '4',
      routeId: '2',
      type: 'lost',
      category: 'Personal Items',
      description: 'Black wallet with citizenship and ID cards',
      location: 'Maharajgunj',
      date: '2026-01-16',
      status: 'open',
      reportedBy: 'Sunita Gurung',
      contactEmail: 'sunita.gurung@email.com',
      imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHx3YWxsZXR8ZW58MXx8fHwxNzY4NzMxNTA4fDA&ixlib=rb-4.1.0&q=80&w=1080'
    }
  ]);

  function handleAddItem(newItem) {
    const itemWithId = {
      ...newItem,
      id: Date.now().toString(),
    };
    setItems([...items, itemWithId]);
    navigate('/');
  }

  function handleUpdateItemStatus(itemId, newStatus) {
    setItems(items.map(item => 
      item.id === itemId ? { ...item, status: newStatus } : item
    ));
  }

  function handleDeleteItem(itemId) {
    setItems(items.filter(item => item.id !== itemId));
  }

  // At this point, user is logged in
  return (
    <Routes>
      <Route path="/report" element={<ReportItemPage user={user} logout={logout} onAddItem={handleAddItem} />} />
      <Route path="/" element={<DashboardPage user={user} logout={logout} items={items} onUpdateItemStatus={handleUpdateItemStatus} onDeleteItem={handleDeleteItem} />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// Dashboard page component
function DashboardPage({ user, logout, items, onUpdateItemStatus, onDeleteItem }) {
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

// Report item page component
function ReportItemPage({ user, logout, onAddItem }) {
  const navigate = useNavigate();
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

  let displayName = 'User';
  if (user && user.name) {
    displayName = user.name;
  }

  function handleLogoutClick() {
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
                <p className="text-sm text-sky-600">Lost & Found System</p>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sky-700 text-sm">
                Welcome, {user && user.name ? user.name : 'User'}
              </span>
              <Link to="/" className="px-4 py-2 rounded-lg font-medium bg-green-500 text-white hover:bg-green-400 transition">
                Dashboard
              </Link>
              <button
                onClick={handleLogoutClick}
                className="px-4 py-2 rounded-lg font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <ReportItem
          routes={routes}
          onSubmit={onAddItem}
          onCancel={() => navigate('/')}
        />
      </main>
    </div>
  );
}

// Main App Component
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<AuthenticatedRoutes />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Login } from './components/Login';
import { Signup } from './components/Signup';
import { DashboardPage } from './pages/DashboardPage';
import { ReportItemPage } from './pages/ReportItemPage';

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

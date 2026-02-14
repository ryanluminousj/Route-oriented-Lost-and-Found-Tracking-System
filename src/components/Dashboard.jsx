import { useState } from 'react';
import { AlertCircle, CheckCircle, Users, CheckSquare, Search } from 'lucide-react';
import { RouteCard } from './RouteCard';
import { ItemCard } from './ItemCard';
import { MatchesPanel } from './MatchesPanel';

// Individual stat card for displaying counts
function StatCard({ title, value, icon: Icon, color }) {
  const colors = {
    red: { bg: 'bg-red-100', text: 'text-red-600' },
    green: { bg: 'bg-green-100', text: 'text-green-600' },
    blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-600' }
  };

  const { bg, text } = colors[color];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className={`text-3xl font-bold ${text} mt-1`}>{value}</p>
        </div>
        <div className={`w-12 h-12 ${bg} rounded-lg flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${text}`} />
        </div>
      </div>
    </div>
  );
}

// Filter and search bar
function SearchAndFilterBar({ searchQuery, setSearchQuery, filterType, setFilterType, filterStatus, setFilterStatus }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Box */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by description, location, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>

        {/* Filters */}
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
        >
          <option value="all">All Types</option>
          <option value="lost">Lost</option>
          <option value="found">Found</option>
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="open">Open</option>
          <option value="claimed">Claimed</option>
          <option value="returned">Returned</option>
        </select>
      </div>
    </div>
  );
}

export function Dashboard({
  routes,
  items,
  matches,
  onViewRoute,
  onUpdateItemStatus,
  onDeleteItem
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Filter items based on what the user searched for
  const filteredItems = items.filter(item => {
    const matchesSearch =
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = filterType === 'all' || item.type === filterType;
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  // Count items by type and status
  const totalLost = items.filter(i => i.type === 'lost' && i.status === 'open').length;
  const totalFound = items.filter(i => i.type === 'found' && i.status === 'open').length;
  const totalClaimed = items.filter(i => i.status === 'claimed').length;
  const totalReturned = items.filter(i => i.status === 'returned').length;

  return (
    <div className="space-y-8">
      {/* Show any matching items first */}
      {matches && matches.length > 0 && (
        <MatchesPanel matches={matches} routes={routes} />
      )}

      {/* Quick Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Lost Items" value={totalLost} icon={AlertCircle} color="red" />
        <StatCard title="Found Items" value={totalFound} icon={CheckCircle} color="green" />
        <StatCard title="Claimed" value={totalClaimed} icon={Users} color="blue" />
        <StatCard title="Returned" value={totalReturned} icon={CheckSquare} color="purple" />
      </div>

      {/* All Available Routes */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Public Transport Routes</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {routes.map(route => (
            <RouteCard
              key={route.id}
              route={route}
              itemCount={items.filter(i => i.routeId === route.id).length}
              onClick={() => onViewRoute && onViewRoute(route.id)}
            />
          ))}
        </div>
      </div>

      {/* Items List with Search and Filters */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Current Items</h2>

        <SearchAndFilterBar 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filterType={filterType}
          setFilterType={setFilterType}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
        />

        {/* Display items or empty state */}
        <div className="space-y-4 mt-4">
          {filteredItems.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <p className="text-gray-500">No items found</p>
            </div>
          ) : (
            filteredItems.map(item => (
              <ItemCard
                key={item.id}
                item={item}
                route={routes.find(r => r.id === item.routeId)}
                onUpdateStatus={onUpdateItemStatus}
                onDelete={onDeleteItem}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { AlertCircle, CheckCircle, Users, CheckSquare, Search } from 'lucide-react';
import { RouteCard } from './RouteCard';
import { ItemCard } from './ItemCard';
import { MatchesPanel } from './MatchesPanel';

function StatBadge({ title, value, icon: Icon, color }) {
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

export function Dashboard({
  routes,
  items,
  matches,
  onViewRoute,
  onUpdateItemStatus,
  onDeleteItem
}) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = items.filter(item => {
    const searchMatch =
      item.description.toLowerCase().includes(search.toLowerCase()) ||
      item.location.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase());
    
    return searchMatch && 
      (typeFilter === 'all' || item.type === typeFilter) &&
      (statusFilter === 'all' || item.status === statusFilter);
  });

  const stats = {
    lost: items.filter(i => i.type === 'lost' && i.status === 'open').length,
    found: items.filter(i => i.type === 'found' && i.status === 'open').length,
    claimed: items.filter(i => i.status === 'claimed').length,
    returned: items.filter(i => i.status === 'returned').length,
  };

  return (
    <div className="space-y-8">
      {matches?.length > 0 && <MatchesPanel matches={matches} routes={routes} />}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatBadge title="Lost Items" value={stats.lost} icon={AlertCircle} color="red" />
        <StatBadge title="Found Items" value={stats.found} icon={CheckCircle} color="green" />
        <StatBadge title="Claimed" value={stats.claimed} icon={Users} color="blue" />
        <StatBadge title="Returned" value={stats.returned} icon={CheckSquare} color="purple" />
      </div>

      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Public Transport Routes</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {routes.map(route => (
            <RouteCard
              key={route.id}
              route={route}
              itemCount={items.filter(i => i.routeId === route.id).length}
              onClick={() => onViewRoute?.(route.id)}
            />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Current Items</h2>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search items..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="lost">Lost</option>
              <option value="found">Found</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="claimed">Claimed</option>
              <option value="returned">Returned</option>
            </select>
          </div>
        </div>

        <div className="space-y-4 mt-4">
          {filtered.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <p className="text-gray-500">No items found</p>
            </div>
          ) : (
            filtered.map(item => (
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

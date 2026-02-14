import { ItemCard } from './ItemCard';
import { ArrowLeft, MapPin, Bus } from 'lucide-react';

export function RouteView({ route, items, onBack, onUpdateItemStatus, onDeleteItem }) {
  if (!route) return null;

  const lost = items.filter(i => i.type === 'lost');
  const found = items.filter(i => i.type === 'found');

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <div className="flex items-center gap-3 flex-1">
          <div
            className="w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: route.color + '20' }}
          >
            <Bus className="w-8 h-8" style={{ color: route.color }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{route.name}</h1>
            <p className="text-sm text-gray-500">{items.length} items on this route</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Stops</h2>
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {route.stops.map((stop, idx) => (
            <div key={stop} className="flex items-center flex-shrink-0">
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
                <MapPin className="w-4 h-4" style={{ color: route.color }} />
                <span className="text-sm font-medium text-gray-700">{stop}</span>
              </div>
              {idx < route.stops.length - 1 && (
                <div className="w-8 h-0.5 bg-gray-300 mx-1" />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-500">Total Items</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{items.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-500">Lost Items</p>
          <p className="text-3xl font-bold text-red-600 mt-1">{lost.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-500">Found Items</p>
          <p className="text-3xl font-bold text-green-600 mt-1">{found.length}</p>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Items by Location</h2>
        {route.stops.map(stop => {
          const stopItems = items.filter(i => i.location === stop);
          if (stopItems.length === 0) return null;

          return (
            <div key={stop} className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-5 h-5" style={{ color: route.color }} />
                <h3 className="font-semibold text-gray-900">{stop}</h3>
                <span className="text-sm text-gray-500">({stopItems.length})</span>
              </div>
              <div className="space-y-4">
                {stopItems.map(item => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    route={route}
                    onUpdateStatus={onUpdateItemStatus}
                    onDelete={onDeleteItem}
                  />
                ))}
              </div>
            </div>
          );
        })}

        {items.every(i => !route.stops.includes(i.location)) && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <p className="text-gray-500">No items on this route yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

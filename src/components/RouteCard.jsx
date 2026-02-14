import { MapPin, Bus } from 'lucide-react';

export function RouteCard({ route, itemCount, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: route.color + '20' }}
          >
            <Bus className="w-6 h-6" style={{ color: route.color }} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{route.name}</h3>
            <p className="text-sm text-gray-500">{route.stops.length} stops</p>
          </div>
        </div>
        <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
          {itemCount} items
        </div>
      </div>

      <div className="flex items-start gap-2">
        <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-gray-600 line-clamp-2">
          {route.stops.join(' → ')}
        </div>
      </div>
    </div>
  );
}

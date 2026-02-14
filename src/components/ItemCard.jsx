import { useState } from 'react';
import { MapPin, Calendar, User, Mail, MoreVertical, Trash2 } from 'lucide-react';

export function ItemCard({ item, route, onUpdateStatus, onDelete }) {
  const [showMenu, setShowMenu] = useState(false);

  const statusColors = {
    open: 'bg-yellow-100 text-yellow-800',
    claimed: 'bg-blue-100 text-blue-800',
    returned: 'bg-green-100 text-green-800',
  };

  const typeColors = {
    lost: 'bg-red-100 text-red-800',
    found: 'bg-green-100 text-green-800',
  };

  // Get emoji based on category
  const getCategoryEmoji = (category) => {
    const emojiMap = {
      'Electronics': '📱',
      'Personal Items': '👜',
      'Clothing': '👕',
      'Accessories': '⌚',
      'Documents': '📄',
      'Other': '📦',
    };
    return emojiMap[category] || '📦';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4 flex-1">
          {/* Item Image or Category Icon */}
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.description}
              className="w-20 h-20 rounded-lg object-cover flex-shrink-0 border border-gray-200"
            />
          ) : (
            <div
              className="w-20 h-20 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: route.color + '20' }}
            >
              <span className="text-2xl">{getCategoryEmoji(item.category)}</span>
            </div>
          )}

          <div className="flex-1 min-w-0">
            {/* Type and Status Badges */}
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeColors[item.type]}`}>
                {item.type.toUpperCase()}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[item.status]}`}>
                {item.status.toUpperCase()}
              </span>
              <span className="text-xs text-gray-500">{item.category}</span>
            </div>

            {/* Description */}
            <h3 className="font-semibold text-gray-900 mb-2">{item.description}</h3>

            {/* Item Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: route.color }}
                />
                <span className="truncate">{route.name}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{item.location}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4 flex-shrink-0" />
                <span>{new Date(item.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <User className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{item.reportedBy}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 md:col-span-2">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{item.contactEmail}</span>
              </div>
            </div>
          </div>
        </div>

        {/* More Menu */}
        <div className="relative ml-4">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Item options"
          >
            <MoreVertical className="w-5 h-5 text-gray-500" />
          </button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                {item.status === 'open' && (
                  <button
                    onClick={() => {
                      onUpdateStatus(item.id, 'claimed');
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors"
                  >
                    Mark as Claimed
                  </button>
                )}
                {item.status === 'claimed' && (
                  <button
                    onClick={() => {
                      onUpdateStatus(item.id, 'returned');
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors"
                  >
                    Mark as Returned
                  </button>
                )}
                {item.status !== 'open' && (
                  <button
                    onClick={() => {
                      onUpdateStatus(item.id, 'open');
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors"
                  >
                    Mark as Open
                  </button>
                )}
                <button
                  onClick={() => {
                    onDelete(item.id);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Item
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

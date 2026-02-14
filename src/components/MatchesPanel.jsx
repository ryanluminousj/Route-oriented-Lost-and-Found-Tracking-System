import { useState } from 'react';
import { ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

export function MatchesPanel({ matches, routes }) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-gray-900">Potential Matches Found</h3>
            <p className="text-sm text-gray-600">
              {matches.length} possible {matches.length === 1 ? 'match' : 'matches'} between lost and found items
            </p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>

      {isExpanded && (
        <div className="px-6 pb-6 space-y-4">
          {matches.map((match) => {
            const route = routes.find(r => r.id === match.lostItem.routeId);

            return (
              <div
                key={`${match.lostItem.id}-${match.foundItem.id}`}
                className="bg-white rounded-lg border border-purple-200 overflow-hidden"
              >
                <div className="p-4">
                  {/* Route and Match Score */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: route?.color || '#6B7280' }}
                      />
                      <span className="font-medium text-gray-900">{route?.name}</span>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      match.matchScore >= 70 ? 'bg-green-100 text-green-800' :
                      match.matchScore >= 50 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {match.matchScore}% Match
                    </div>
                  </div>

                  {/* Lost and Found Items */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    {/* Lost Item */}
                    <div className="flex gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                      {match.lostItem.imageUrl ? (
                        <img
                          src={match.lostItem.imageUrl}
                          alt="Lost item"
                          className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-2xl">🔍</span>
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-medium text-red-800 mb-1">LOST</div>
                        <div className="font-medium text-gray-900 text-sm line-clamp-2">
                          {match.lostItem.description}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          {match.lostItem.location} • {new Date(match.lostItem.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    {/* Found Item */}
                    <div className="flex gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                      {match.foundItem.imageUrl ? (
                        <img
                          src={match.foundItem.imageUrl}
                          alt="Found item"
                          className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-2xl">✨</span>
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-medium text-green-800 mb-1">FOUND</div>
                        <div className="font-medium text-gray-900 text-sm line-clamp-2">
                          {match.foundItem.description}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          {match.foundItem.location} • {new Date(match.foundItem.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Match Reasons */}
                  <div className="flex flex-wrap gap-2">
                    {match.matchReasons.map((reason, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                      >
                        {reason}
                      </span>
                    ))}
                  </div>

                  {/* Contact Info */}
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-gray-500">Lost by:</span>{' '}
                        <span className="font-medium">{match.lostItem.reportedBy}</span>
                        <span className="text-gray-400 ml-1">({match.lostItem.contactEmail})</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Found by:</span>{' '}
                        <span className="font-medium">{match.foundItem.reportedBy}</span>
                        <span className="text-gray-400 ml-1">({match.foundItem.contactEmail})</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

import { useState } from 'react';
import { ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

export function MatchesPanel({ matches, routes }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-gray-900">Potential Matches Found</h3>
            <p className="text-sm text-gray-600">
              {matches.length} possible {matches.length === 1 ? 'match' : 'matches'}
            </p>
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>

      {expanded && (
        <div className="px-6 pb-6 space-y-4">
          {matches.map((match) => {
            const route = routes.find(r => r.id === match.lostItem.routeId);
            const scoreColor = match.matchScore >= 70 ? 'green' : match.matchScore >= 50 ? 'yellow' : 'gray';
            const colors = {
              green: 'bg-green-100 text-green-800',
              yellow: 'bg-yellow-100 text-yellow-800',
              gray: 'bg-gray-100 text-gray-800'
            };

            return (
              <div
                key={`${match.lostItem.id}-${match.foundItem.id}`}
                className="bg-white rounded-lg border border-purple-200 overflow-hidden p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: route?.color || '#6B7280' }}
                    />
                    <span className="font-medium text-gray-900">{route?.name}</span>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${colors[scoreColor]}`}>
                    {match.matchScore}% Match
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
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

                <div className="flex flex-wrap gap-2 mb-3">
                  {match.matchReasons.map((reason, idx) => (
                    <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                      {reason}
                    </span>
                  ))}
                </div>

                <div className="pt-3 border-t border-gray-200">
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
            );
          })}
        </div>
      )}
    </div>
  );
}

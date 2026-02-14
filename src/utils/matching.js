export function findMatches(items) {
  // Get all open lost and found items
  const lostItems = items.filter(i => i.type === 'lost' && i.status === 'open');
  const foundItems = items.filter(i => i.type === 'found' && i.status === 'open');

  const matches = [];

  // Compare each lost item with each found item
  lostItems.forEach(lostItem => {
    foundItems.forEach(foundItem => {
      // Only match items on the same route
      if (lostItem.routeId !== foundItem.routeId) return;

      const matchReasons = [];
      let matchScore = 0;

      // Same category (high weight)
      if (lostItem.category === foundItem.category) {
        matchScore += 40;
        matchReasons.push('Same category');
      }

      // Same or nearby location
      if (lostItem.location === foundItem.location) {
        matchScore += 30;
        matchReasons.push('Same location');
      }

      // Similar date (within 3 days)
      const lostDate = new Date(lostItem.date);
      const foundDate = new Date(foundItem.date);
      const daysDiff = Math.abs((foundDate.getTime() - lostDate.getTime()) / (1000 * 60 * 60 * 24));

      if (daysDiff <= 1) {
        matchScore += 20;
        matchReasons.push('Same day');
      } else if (daysDiff <= 3) {
        matchScore += 10;
        matchReasons.push('Within 3 days');
      }

      // Description similarity (keyword matching)
      const lostWords = lostItem.description.toLowerCase().split(/\s+/);
      const foundWords = foundItem.description.toLowerCase().split(/\s+/);
      const commonWords = lostWords.filter(
        word => word.length > 3 && foundWords.includes(word)
      );

      if (commonWords.length > 0) {
        matchScore += Math.min(commonWords.length * 10, 30);
        matchReasons.push(
          `Similar description (${commonWords.length} matching keywords)`
        );
      }

      // Only include matches with a reasonable score
      if (matchScore >= 40) {
        matches.push({
          lostItem,
          foundItem,
          matchScore,
          matchReasons
        });
      }
    });
  });

  // Sort by match score (highest first)
  return matches.sort((a, b) => b.matchScore - a.matchScore);
}

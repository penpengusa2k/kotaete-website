import { patterns } from '../data/relationship_patterns';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const name1 = body.name1;
  const name2 = body.name2;

  if (!name1 || !name2) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Both names are required.',
    });
  }

  // Ensure consistent order for hashing
  const sortedNames = [name1, name2].sort();
  const combinedNames = sortedNames[0] + sortedNames[1];

  // Simple string hashing function
  let hash = 0;
  for (let i = 0; i < combinedNames.length; i++) {
    const char = combinedNames.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32bit integer
  }

  const lovePatterns = patterns.filter(p => p.category === '恋愛');
  const friendshipPatterns = patterns.filter(p => p.category === '友情');
  const workPatterns = patterns.filter(p => p.category === '仕事');

  const loveResult = lovePatterns.length > 0 ? lovePatterns[Math.abs(hash) % lovePatterns.length] : null;
  const friendshipResult = friendshipPatterns.length > 0 ? friendshipPatterns[Math.abs(hash) % friendshipPatterns.length] : null;
  const workResult = workPatterns.length > 0 ? workPatterns[Math.abs(hash) % workPatterns.length] : null;

  return {
    love: loveResult,
    friendship: friendshipResult,
    work: workResult,
  };
});

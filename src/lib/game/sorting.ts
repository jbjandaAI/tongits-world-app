import { Card } from '@/types/game';

// Helper to sort cards by Suit then Value
const sortBySuitThenValue = (a: Card, b: Card) => {
  if (a.suit !== b.suit) return a.suit.localeCompare(b.suit);
  return a.value - b.value;
};

// --- Backtracking Solver Logic ---

/**
 * Finds all valid melds (Sets and Runs) that INCLUDE the target card.
 * This is used for the "use this card" branch of the recursion.
 */
function getMeldsWithCard(target: Card, pool: Card[]): Card[][] {
  const melds: Card[][] = [];

  // 1. Check for Sets (Same Rank)
  // We need at least 2 other cards of same rank
  const sameRank = pool.filter(c => c.rank === target.rank && c.id !== target.id);

  if (sameRank.length >= 2) {
    // We can take all of them + target
    const fullSet = [target, ...sameRank];
    melds.push(fullSet);

    // If we have 3 others (total 4), we also could take just 2 others (total 3)
    if (sameRank.length === 3) {
      // Combinations of 2 from 3
      for (let i = 0; i < sameRank.length; i++) {
        for (let j = i + 1; j < sameRank.length; j++) {
          melds.push([target, sameRank[i], sameRank[j]]);
        }
      }
    }
  }

  // 2. Check for Runs (Same Suit, Sequence)
  const sameSuit = pool.filter(c => c.suit === target.suit && c.id !== target.id);
  // Sort pool by value for easier checking
  sameSuit.sort((a, b) => a.value - b.value);

  // We need to form a sequence of at least 3 incl target.
  const tVal = target.value;

  // Potential cards by value lookup
  const valMap = new Map<number, Card>();
  sameSuit.forEach(c => valMap.set(c.value, c)); 
  valMap.set(tVal, target);

  // Check valid continuous ranges [start, end] containing tVal, length >= 3
  for (let start = Math.max(1, tVal - 12); start <= tVal; start++) {
    if (!valMap.has(start)) continue;

    const currentParamRun: Card[] = [];

    // Build forward from start
    for (let v = start; v <= 13; v++) {
      if (!valMap.has(v)) break;
      currentParamRun.push(valMap.get(v)!);

      // If we have covered tVal and length >= 3, it's a valid run
      if (v >= tVal && currentParamRun.length >= 3) {
        melds.push([...currentParamRun]);
      }
    }
  }

  return melds;
}

/**
 * Recursive solver to maximize melded cards.
 * Returns { melded: Card[][], remaining: Card[] }
 */
function solveHand(currentHand: Card[]): { melded: Card[][], remaining: Card[] } {
  // Base case
  if (currentHand.length < 3) {
    return { melded: [], remaining: currentHand };
  }

  // Pick the first card
  const first = currentHand[0];
  const rest = currentHand.slice(1);

  // Option 1: Treat 'first' as deadwood
  const resultSkip = solveHand(rest);
  const bestSkip = {
    melded: resultSkip.melded,
    remaining: [first, ...resultSkip.remaining]
  };

  let bestResult = bestSkip;
  const countMelded = (melds: Card[][]) => melds.reduce((acc, m) => acc + m.length, 0);

  // Option 2: Try to form a meld with 'first'
  const possibleMelds = getMeldsWithCard(first, rest);

  for (const meld of possibleMelds) {
    // Meld is [first, ...some cards from rest]
    // Filter out used cards from 'rest'
    const usedIds = new Set(meld.map(c => c.id));
    const nextRest = rest.filter(c => !usedIds.has(c.id));

    const subResult = solveHand(nextRest);

    // Total melded for this branch
    const branchMelded = [meld, ...subResult.melded];
    const branchRemaining = subResult.remaining; 

    if (countMelded(branchMelded) > countMelded(bestResult.melded)) {
      bestResult = { melded: branchMelded, remaining: branchRemaining };
    }
  }

  return bestResult;
}

export function groupHand(hand: Card[]): Card[] {
  // Clear existing group IDs first
  const input = hand.map(c => ({ ...c, groupId: undefined }));

  // Sort input first to ensure deterministic behavior (id-wise) if values same
  const sortedInput = [...input].sort(sortBySuitThenValue);

  // Run the solver
  const solution = solveHand(sortedInput);

  // Assign group IDs to melded groups
  const finalMelded: Card[] = [];
  solution.melded.forEach((group, idx) => {
    // Create a deterministic but unique ID for the group
    const groupId = `group-${idx}-${Date.now()}`;
    const groupCards = group.map(c => ({ ...c, groupId }));
    finalMelded.push(...groupCards);
  });

  // Sort remaining deadwood
  const finalRemaining = solution.remaining.map(c => ({ ...c, groupId: undefined }));
  finalRemaining.sort(sortBySuitThenValue);

  return [...finalMelded, ...finalRemaining];
}

export function sortHandBySuit(hand: Card[]): Card[] {
  return [...hand].sort(sortBySuitThenValue);
}

export function sortHandByRank(hand: Card[]): Card[] {
  return [...hand].sort((a, b) => {
    if (a.value !== b.value) return a.value - b.value;
    return a.suit.localeCompare(b.suit);
  });
}
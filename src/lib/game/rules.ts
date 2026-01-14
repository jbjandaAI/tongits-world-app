import { Card, Meld } from '@/types/game';

// Check if a group of cards is a valid Set (3+ cards of same rank)
export function isValidSet(cards: Card[]): boolean {
  if (cards.length < 3) return false;
  const firstRank = cards[0].rank;
  return cards.every(card => card.rank === firstRank);
}

// Check if a group of cards is a valid Run (3+ consecutive cards of same suit)
export function isValidRun(cards: Card[]): boolean {
  if (cards.length < 3) return false;
  
  // Must be same suit
  const firstSuit = cards[0].suit;
  if (!cards.every(card => card.suit === firstSuit)) return false;

  // Sort by value
  const sorted = [...cards].sort((a, b) => a.value - b.value);

  // Check consecutive values
  for (let i = 0; i < sorted.length - 1; i++) {
    if (sorted[i + 1].value !== sorted[i].value + 1) {
      return false;
    }
  }
  return true;
}

export function isValidMeld(cards: Card[]): boolean {
  return isValidSet(cards) || isValidRun(cards);
}

// Identify all possible melds in a hand (simple greedy approach or just helper for hints)
export function findPotentialMelds(hand: Card[]): Meld[] {
  // This is a complex logic for auto-sorting/hinting, skipping for MVP
  // Implementing a basic check for now
  return [];
}

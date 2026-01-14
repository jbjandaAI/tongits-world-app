import { Card } from '@/types/game';
import { isValidSet, isValidRun } from './rules';

// Helper to sort cards by value (for runs)
const sortByValue = (a: Card, b: Card) => a.value - b.value;

// Helper to sort cards by Suit then Value
const sortBySuitThenValue = (a: Card, b: Card) => {
  if (a.suit !== b.suit) return a.suit.localeCompare(b.suit);
  return a.value - b.value;
};

export function groupHand(hand: Card[]): Card[] {
  // We need to find melds and group them.
  // Strategy:
  // 1. Find all Sets (3+ of same rank)
  // 2. From the REMAINING cards, find all Runs (3+ of same suit in sequence)
  // 3. Sort the rest by Suit/Value
  
  const remainingCards = [...hand];
  const meldedCards: Card[] = [];
  
  // 1. Find Sets
  const rankGroups = new Map<string, Card[]>();
  remainingCards.forEach(card => {
    const group = rankGroups.get(card.rank) || [];
    group.push(card);
    rankGroups.set(card.rank, group);
  });
  
  for (const [rank, cards] of rankGroups.entries()) {
    if (cards.length >= 3) {
      // It's a set!
      meldedCards.push(...cards);
      // Remove from remaining
      cards.forEach(c => {
        const idx = remainingCards.findIndex(rc => rc.id === c.id);
        if (idx !== -1) remainingCards.splice(idx, 1);
      });
    }
  }
  
  // 2. Find Runs from Remaining
  // Group by suit first
  const suitGroups = new Map<string, Card[]>();
  remainingCards.forEach(card => {
    const group = suitGroups.get(card.suit) || [];
    group.push(card);
    suitGroups.set(card.suit, group);
  });
  
  for (const [suit, cards] of suitGroups.entries()) {
    // Sort by value to find sequences
    cards.sort(sortByValue);
    
    let currentRun: Card[] = [];
    
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      
      if (currentRun.length === 0) {
        currentRun.push(card);
      } else {
        const lastCard = currentRun[currentRun.length - 1];
        if (card.value === lastCard.value + 1) {
          currentRun.push(card);
        } else {
          // Break in sequence
          if (currentRun.length >= 3) {
            meldedCards.push(...currentRun);
            // Remove from remaining (logic below handled by loop end check usually, but we need to track what's used)
             currentRun.forEach(c => {
                const idx = remainingCards.findIndex(rc => rc.id === c.id);
                if (idx !== -1) remainingCards.splice(idx, 1);
            });
          }
          currentRun = [card];
        }
      }
    }
    
    // Check last run
    if (currentRun.length >= 3) {
      meldedCards.push(...currentRun);
      currentRun.forEach(c => {
        const idx = remainingCards.findIndex(rc => rc.id === c.id);
        if (idx !== -1) remainingCards.splice(idx, 1);
      });
    }
  }
  
  // 3. Sort Remaining
  remainingCards.sort(sortBySuitThenValue);
  
  return [...meldedCards, ...remainingCards];
}

// Alternative: Just simple sort
export function sortHandBySuit(hand: Card[]): Card[] {
  return [...hand].sort(sortBySuitThenValue);
}

export function sortHandByRank(hand: Card[]): Card[] {
  return [...hand].sort((a, b) => {
    if (a.value !== b.value) return a.value - b.value;
    return a.suit.localeCompare(b.suit);
  });
}

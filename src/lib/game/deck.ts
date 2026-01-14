import { Card, Rank, Suit } from '@/types/game';

const SUITS: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
const RANKS: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

export function createDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (let i = 0; i < RANKS.length; i++) {
      const rank = RANKS[i];
      deck.push({
        id: `${suit}-${rank}`,
        suit,
        rank,
        value: i + 1, // A=1, K=13
      });
    }
  }
  return deck;
}

export function shuffleDeck(deck: Card[]): Card[] {
  const newDeck = [...deck];
  for (let i = newDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
  }
  return newDeck;
}

export function dealCards(deck: Card[], numPlayers: number, cardsPerPlayer: number = 12) {
  const hands: Card[][] = Array.from({ length: numPlayers }, () => []);
  const remainingDeck = [...deck];

  for (let i = 0; i < cardsPerPlayer; i++) {
    for (let p = 0; p < numPlayers; p++) {
      if (remainingDeck.length > 0) {
        hands[p].push(remainingDeck.pop()!);
      }
    }
  }
  
  // In Tongits, the dealer (usually player 0) gets one extra card or draws first.
  // We'll stick to standard distribution and let the game state handle the first draw/extra card logic if needed.
  // Often dealer gets 13, others 12. Let's give player 0 one extra card if deck allows.
  if (remainingDeck.length > 0) {
     hands[0].push(remainingDeck.pop()!);
  }

  return { hands, remainingDeck };
}

export function calculatePoints(hand: Card[]): number {
  return hand.reduce((total, card) => {
    // Face cards are 10, others are face value. Ace is 1 usually in calculation unless specified otherwise.
    // In many variations: A=1, 2-9=face, 10-K=10.
    let val = card.value;
    if (card.rank === 'A') val = 1;
    else if (['10', 'J', 'Q', 'K'].includes(card.rank)) val = 10;
    else val = parseInt(card.rank); // 2-9
    
    return total + val;
  }, 0);
}

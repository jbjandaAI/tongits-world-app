export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export interface Card {
  id: string; // Unique ID for React keys (e.g., "hearts-10")
  suit: Suit;
  rank: Rank;
  value: number; // 1-13 for sorting/logic
}

export interface Meld {
  id: string;
  cards: Card[];
  type: 'set' | 'run'; // Set (e.g., 7-7-7) or Run (e.g., 4-5-6)
}

export interface Player {
  id: string;
  name: string;
  hand: Card[];
  exposedMelds: Meld[];
  isBot: boolean;
  points: number; // For end game calculation
}

export type GamePhase = 'waiting' | 'dealing' | 'playing' | 'ended';

export interface GameState {
  deck: Card[];
  discardPile: Card[];
  players: Player[];
  currentTurnIndex: number; // Index of the player whose turn it is
  currentPlayerId: string;
  phase: GamePhase;
  winnerId: string | null;
  turnCount: number;
}

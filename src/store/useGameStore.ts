import { create } from 'zustand';
import { GameState, Player, Card, Meld } from '@/types/game';
import { createDeck, shuffleDeck, dealCards, calculatePoints } from '@/lib/game/deck';
import { isValidMeld } from '@/lib/game/rules';
import { groupHand } from '@/lib/game/sorting';

interface GameStore extends GameState {
  startGame: () => void;
  drawCard: (playerId: string) => void;
  discardCard: (playerId: string, cardId: string) => void;
  meldCards: (playerId: string, cards: Card[]) => void;
  chowCard: (playerId: string, card: Card, meldCards: Card[]) => void;
  checkWinner: () => void;
  reorderHand: (playerId: string, newHand: Card[]) => void;
  autoArrangeHand: (playerId: string) => void;
}

const INITIAL_PLAYERS: Player[] = [
  { id: 'p1', name: 'You', hand: [], exposedMelds: [], isBot: false, points: 0 },
  { id: 'bot1', name: 'Bot 1', hand: [], exposedMelds: [], isBot: true, points: 0 },
  { id: 'bot2', name: 'Bot 2', hand: [], exposedMelds: [], isBot: true, points: 0 },
];

export const useGameStore = create<GameStore>((set, get) => ({
  deck: [],
  discardPile: [],
  players: INITIAL_PLAYERS,
  currentTurnIndex: 0,
  currentPlayerId: 'p1',
  phase: 'waiting',
  winnerId: null,
  turnCount: 0,

  startGame: () => {
    const deck = shuffleDeck(createDeck());
    const { hands, remainingDeck } = dealCards(deck, 3);
    
    const newPlayers = INITIAL_PLAYERS.map((p, i) => ({
      ...p,
      hand: hands[i],
      exposedMelds: [],
      points: 0,
    }));

    set({
      deck: remainingDeck,
      discardPile: [],
      players: newPlayers,
      currentTurnIndex: 0,
      currentPlayerId: newPlayers[0].id,
      phase: 'playing',
      winnerId: null,
      turnCount: 0,
    });
  },

  drawCard: (playerId) => {
    const { deck, currentPlayerId, players } = get();
    if (playerId !== currentPlayerId) return;
    if (deck.length === 0) {
      get().checkWinner();
      return;
    }

    const newDeck = [...deck];
    const card = newDeck.pop()!;
    
    const newPlayers = players.map(p => 
      p.id === playerId ? { ...p, hand: [...p.hand, card] } : p
    );

    set({ deck: newDeck, players: newPlayers });
  },

  discardCard: (playerId, cardId) => {
    const { players, currentTurnIndex, currentPlayerId, discardPile } = get();
    if (playerId !== currentPlayerId) return;

    const player = players.find(p => p.id === playerId);
    if (!player) return;

    const cardToDiscard = player.hand.find(c => c.id === cardId);
    if (!cardToDiscard) return;

    const newHand = player.hand.filter(c => c.id !== cardId);
    const newDiscardPile = [...discardPile, cardToDiscard];
    const newPlayers = players.map(p => 
      p.id === playerId ? { ...p, hand: newHand } : p
    );

    // Simple turn passing
    const nextTurnIndex = (currentTurnIndex + 1) % players.length;
    
    set({
      players: newPlayers,
      discardPile: newDiscardPile,
      currentTurnIndex: nextTurnIndex,
      currentPlayerId: players[nextTurnIndex].id,
    });
    
    // Check if player won (empty hand)
    if (newHand.length === 0) {
      set({ phase: 'ended', winnerId: playerId });
    }
  },

  meldCards: (playerId, cards) => {
    const { players, currentPlayerId } = get();
    if (playerId !== currentPlayerId) return;
    
    if (!isValidMeld(cards)) return; // Validation logic

    const player = players.find(p => p.id === playerId);
    if (!player) return;

    // Remove cards from hand
    const cardIds = new Set(cards.map(c => c.id));
    const newHand = player.hand.filter(c => !cardIds.has(c.id));
    
    const newMeld: Meld = {
      id: Date.now().toString(),
      cards,
      type: cards[0].rank === cards[1].rank ? 'set' : 'run'
    };

    const newPlayers = players.map(p => 
      p.id === playerId ? { ...p, hand: newHand, exposedMelds: [...p.exposedMelds, newMeld] } : p
    );

    set({ players: newPlayers });
  },

  chowCard: (playerId, card, meldCards) => {
    // Placeholder for Chow logic (taking from discard pile)
  },

  checkWinner: () => {
    // End game logic based on points if deck empty
    const { players } = get();
    const sortedPlayers = [...players].sort((a, b) => calculatePoints(a.hand) - calculatePoints(b.hand));
    set({ phase: 'ended', winnerId: sortedPlayers[0].id });
  },

  reorderHand: (playerId, newHand) => {
    const { players } = get();
    const newPlayers = players.map(p => 
      p.id === playerId ? { ...p, hand: newHand } : p
    );
    set({ players: newPlayers });
  },

  autoArrangeHand: (playerId) => {
    const { players } = get();
    const player = players.find(p => p.id === playerId);
    if (!player) return;

    const newHand = groupHand(player.hand);
    
    const newPlayers = players.map(p => 
      p.id === playerId ? { ...p, hand: newHand } : p
    );
    set({ players: newPlayers });
  }
}));

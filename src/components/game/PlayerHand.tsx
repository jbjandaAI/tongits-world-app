import React, { useState } from 'react';
import { Card as CardType } from '@/types/game';
import { Card } from './Card';
import { useGameStore } from '@/store/useGameStore';

interface PlayerHandProps {
  hand: CardType[];
  playerId: string;
  isCurrentUser: boolean;
}

export const PlayerHand: React.FC<PlayerHandProps> = ({ hand, playerId, isCurrentUser }) => {
  const [selectedCardIds, setSelectedCardIds] = useState<Set<string>>(new Set());
  const { discardCard, meldCards } = useGameStore();

  const toggleSelect = (cardId: string) => {
    if (!isCurrentUser) return;
    
    const newSelected = new Set(selectedCardIds);
    if (newSelected.has(cardId)) {
      newSelected.delete(cardId);
    } else {
      newSelected.add(cardId);
    }
    setSelectedCardIds(newSelected);
  };

  const handleDiscard = () => {
    if (selectedCardIds.size !== 1) return; // Can only discard 1 card
    const cardId = Array.from(selectedCardIds)[0];
    discardCard(playerId, cardId);
    setSelectedCardIds(new Set());
  };

  const handleMeld = () => {
    const cards = hand.filter(c => selectedCardIds.has(c.id));
    meldCards(playerId, cards);
    setSelectedCardIds(new Set());
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="flex -space-x-8 overflow-x-auto p-4 min-h-[120px]">
        {hand.map((card) => (
          <Card 
            key={card.id} 
            card={card} 
            isFaceUp={isCurrentUser} // Bots/Opponents cards are face down
            isSelected={selectedCardIds.has(card.id)}
            onClick={() => toggleSelect(card.id)}
          />
        ))}
      </div>
      
      {isCurrentUser && (
        <div className="flex space-x-2">
          <button 
            disabled={selectedCardIds.size !== 1}
            onClick={handleDiscard}
            className="px-4 py-2 bg-red-500 text-white rounded disabled:opacity-50"
          >
            Discard
          </button>
          <button 
            disabled={selectedCardIds.size < 3}
            onClick={handleMeld}
            className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
          >
            Meld
          </button>
        </div>
      )}
    </div>
  );
};

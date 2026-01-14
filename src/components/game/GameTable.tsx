import React from 'react';
import { useGameStore } from '@/store/useGameStore';
import { Card } from './Card';
import { PlayerHand } from './PlayerHand';

export const GameTable: React.FC = () => {
  const { 
    players, 
    discardPile, 
    currentPlayerId, 
    currentTurnIndex, 
    deck, 
    drawCard,
    phase,
    winnerId,
    startGame 
  } = useGameStore();

  const currentUser = players[0]; // Assuming player 0 is always 'You' for MVP

  if (phase === 'waiting' || phase === 'ended') {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <h1 className="text-3xl font-bold">Tongits World</h1>
        {winnerId && <p className="text-xl text-yellow-500">Winner: {players.find(p => p.id === winnerId)?.name}</p>}
        <button 
          onClick={startGame}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold text-lg shadow-lg active:scale-95 transition-transform"
        >
          {phase === 'waiting' ? 'Start Game' : 'Play Again'}
        </button>
      </div>
    );
  }

  const topDiscard = discardPile.length > 0 ? discardPile[discardPile.length - 1] : null;

  return (
    <div className="flex flex-col h-full justify-between py-4 bg-green-800/20 rounded-xl">
      {/* Opponents Area */}
      <div className="flex justify-center space-x-4">
        {players.slice(1).map(player => (
          <div key={player.id} className="flex flex-col items-center">
            <div className="text-xs text-gray-400 mb-1">{player.name}</div>
            <PlayerHand 
              hand={player.hand} 
              playerId={player.id} 
              isCurrentUser={false} 
            />
          </div>
        ))}
      </div>

      {/* Center Table Area: Deck & Discard */}
      <div className="flex justify-center items-center space-x-8 my-4">
        {/* Draw Pile */}
        <div 
          onClick={() => drawCard(currentUser.id)}
          className="relative cursor-pointer group"
        >
          <div className="w-16 h-24 bg-blue-800 rounded-lg border-2 border-white shadow-xl flex items-center justify-center">
            <span className="text-white font-bold text-xs">DECK</span>
          </div>
          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {deck.length}
          </div>
        </div>

        {/* Discard Pile */}
        <div className="relative">
          {topDiscard ? (
            <Card card={topDiscard} isFaceUp={true} />
          ) : (
            <div className="w-16 h-24 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center text-gray-400 text-xs">
              DISCARD
            </div>
          )}
          <div className="absolute -bottom-6 w-full text-center text-xs text-gray-400">
            Pile
          </div>
        </div>
      </div>

      {/* Current Player Area */}
      <div className="mt-auto">
        <div className="text-center mb-2">
           <span className={players[currentTurnIndex].id === currentUser.id ? "text-green-400 font-bold" : "text-gray-400"}>
             {players[currentTurnIndex].id === currentUser.id ? "Your Turn" : `${players[currentTurnIndex].name}'s Turn`}
           </span>
        </div>
        <PlayerHand 
          hand={currentUser.hand} 
          playerId={currentUser.id} 
          isCurrentUser={true} 
        />
      </div>
    </div>
  );
};

import React from 'react';
import { Card as CardType } from '@/types/game';
import { clsx } from 'clsx';

interface CardProps {
  card: CardType;
  onClick?: () => void;
  isSelected?: boolean;
  isFaceUp?: boolean;
  className?: string;
}

const suitColors = {
  hearts: 'text-red-500',
  diamonds: 'text-red-500',
  clubs: 'text-black',
  spades: 'text-black',
};

const suitIcons = {
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
  spades: '♠',
};

const getGroupColor = (groupId: string) => {
  // Generate a consistent pastel color from the groupId
  const colors = [
    'bg-blue-100',
    'bg-green-100',
    'bg-amber-100',
    'bg-purple-100',
    'bg-pink-100',
    'bg-cyan-100',
  ];
  
  let hash = 0;
  for (let i = 0; i < groupId.length; i++) {
    hash = groupId.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

const getPipPositions = (rank: string): {top: number, left: number}[] => {
  const c = 50;
  const l = 30;
  const r = 70;
  const t = 20;
  const m = 50;
  const b = 80;
  
  switch (rank) {
    case 'A': return [{top: m, left: c}];
    case '2': return [{top: t, left: c}, {top: b, left: c}];
    case '3': return [{top: t, left: c}, {top: m, left: c}, {top: b, left: c}];
    case '4': return [{top: t, left: l}, {top: t, left: r}, {top: b, left: l}, {top: b, left: r}];
    case '5': return [{top: t, left: l}, {top: t, left: r}, {top: m, left: c}, {top: b, left: l}, {top: b, left: r}];
    case '6': return [{top: t, left: l}, {top: t, left: r}, {top: m, left: l}, {top: m, left: r}, {top: b, left: l}, {top: b, left: r}];
    case '7': return [{top: t, left: l}, {top: t, left: r}, {top: m, left: l}, {top: m, left: r}, {top: b, left: l}, {top: b, left: r}, {top: 35, left: c}];
    case '8': return [{top: t, left: l}, {top: t, left: r}, {top: m, left: l}, {top: m, left: r}, {top: b, left: l}, {top: b, left: r}, {top: 35, left: c}, {top: 65, left: c}];
    case '9': return [{top: t, left: l}, {top: t, left: r}, {top: 40, left: l}, {top: 40, left: r}, {top: m, left: c}, {top: 60, left: l}, {top: 60, left: r}, {top: b, left: l}, {top: b, left: r}];
    case '10': return [{top: t, left: l}, {top: t, left: r}, {top: 35, left: l}, {top: 35, left: r}, {top: 65, left: l}, {top: 65, left: r}, {top: b, left: l}, {top: b, left: r}, {top: 25, left: c}, {top: 75, left: c}];
    default: return []; // Face cards handled separately
  }
};

export const Card: React.FC<CardProps> = ({ card, onClick, isSelected, isFaceUp = true, className }) => {
  if (!isFaceUp) {
    return (
      <div 
        className={clsx(
          "w-16 h-24 bg-blue-700 rounded-lg border-2 border-white shadow-md flex items-center justify-center",
          className
        )}
      >
        <div className="w-12 h-20 border border-blue-400 rounded bg-blue-600 opacity-50"></div>
      </div>
    );
  }

  const bgColor = card.groupId ? getGroupColor(card.groupId) : 'bg-white';
  const pipPositions = getPipPositions(card.rank);
  const isFaceCard = ['J', 'Q', 'K'].includes(card.rank);

  return (
    <div 
      onClick={onClick}
      className={clsx(
        "w-16 h-24 rounded-lg border border-gray-300 shadow-md flex flex-col relative select-none cursor-pointer transition-transform overflow-hidden",
        bgColor,
        isSelected && "-translate-y-4 ring-2 ring-blue-500",
        className
      )}
    >
      {/* Top Left Corner */}
      <div className={clsx("absolute top-1 left-1 flex flex-col items-center leading-none z-10", suitColors[card.suit])}>
        <span className="text-xs font-bold">{card.rank}</span>
        <span className="text-[10px]">{suitIcons[card.suit]}</span>
      </div>

      {/* Center Content */}
      <div className="w-full h-full relative">
        {isFaceCard ? (
          <div className={clsx("absolute inset-0 flex items-center justify-center text-4xl", suitColors[card.suit])}>
             {suitIcons[card.suit]}
          </div>
        ) : (
          pipPositions.map((pos, idx) => (
             <div 
               key={idx}
               className={clsx("absolute text-xs", suitColors[card.suit])}
               style={{ 
                 top: `${pos.top}%`, 
                 left: `${pos.left}%`, 
                 transform: 'translate(-50%, -50%)' 
               }}
             >
               {suitIcons[card.suit]}
             </div>
          ))
        )}
      </div>

      {/* Bottom Right Corner */}
      <div className={clsx("absolute bottom-1 right-1 flex flex-col items-center leading-none rotate-180 z-10", suitColors[card.suit])}>
        <span className="text-xs font-bold">{card.rank}</span>
        <span className="text-[10px]">{suitIcons[card.suit]}</span>
      </div>
    </div>
  );
};

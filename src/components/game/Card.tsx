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

      {/* Center Content - Single Large Icon for All Cards */}
      <div className="w-full h-full relative">
        <div className={clsx("absolute inset-0 flex items-center justify-center text-4xl", suitColors[card.suit])}>
            {suitIcons[card.suit]}
        </div>
      </div>

      {/* Bottom Right Corner */}
      <div className={clsx("absolute bottom-1 right-1 flex flex-col items-center leading-none rotate-180 z-10", suitColors[card.suit])}>
        <span className="text-xs font-bold">{card.rank}</span>
        <span className="text-[10px]">{suitIcons[card.suit]}</span>
      </div>
    </div>
  );
};

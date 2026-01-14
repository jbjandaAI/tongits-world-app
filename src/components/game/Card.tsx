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

  return (
    <div 
      onClick={onClick}
      className={clsx(
        "w-16 h-24 bg-white rounded-lg border border-gray-300 shadow-md flex flex-col justify-between p-1 select-none cursor-pointer transition-transform relative",
        isSelected && "-translate-y-4 ring-2 ring-blue-500",
        className
      )}
    >
      <div className={clsx("text-sm font-bold leading-none", suitColors[card.suit])}>
        {card.rank}
      </div>
      <div className={clsx("text-2xl text-center leading-none", suitColors[card.suit])}>
        {suitIcons[card.suit]}
      </div>
      <div className={clsx("text-sm font-bold leading-none self-end rotate-180", suitColors[card.suit])}>
        {card.rank}
      </div>
    </div>
  );
};

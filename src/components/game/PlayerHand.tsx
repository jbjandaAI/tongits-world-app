import React, { useState } from 'react';
import { Card as CardType } from '@/types/game';
import { Card } from './Card';
import { useGameStore } from '@/store/useGameStore';
import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  TouchSensor,
  MouseSensor
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface PlayerHandProps {
  hand: CardType[];
  playerId: string;
  isCurrentUser: boolean;
}

interface SortableCardProps {
  card: CardType;
  isFaceUp: boolean;
  isSelected: boolean;
  onClick: () => void;
  disabled?: boolean;
}

const SortableCard = ({ card, isFaceUp, isSelected, onClick, disabled }: SortableCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: card.id, disabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    touchAction: 'manipulation' // Allow scrolling, but optimized for touch
  };

  // If disabled (not current user), we don't apply listeners/attributes
  if (disabled) {
    return (
      <Card 
        card={card} 
        isFaceUp={isFaceUp} 
        isSelected={isSelected} 
        onClick={onClick}
      />
    );
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card 
        card={card} 
        isFaceUp={isFaceUp} 
        isSelected={isSelected} 
        onClick={onClick}
        className="cursor-grab active:cursor-grabbing"
      />
    </div>
  );
};

export const PlayerHand: React.FC<PlayerHandProps> = ({ hand, playerId, isCurrentUser }) => {
  const [selectedCardIds, setSelectedCardIds] = useState<Set<string>>(new Set());
  const { discardCard, meldCards, reorderHand, autoArrangeHand } = useGameStore();

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 6,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = hand.findIndex((c) => c.id === active.id);
      const newIndex = hand.findIndex((c) => c.id === over.id);
      
      const newHand = arrayMove(hand, oldIndex, newIndex);
      reorderHand(playerId, newHand);
    }
  };

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
    if (selectedCardIds.size !== 1) return;
    const cardId = Array.from(selectedCardIds)[0];
    discardCard(playerId, cardId);
    setSelectedCardIds(new Set());
  };

  const handleMeld = () => {
    const cards = hand.filter(c => selectedCardIds.has(c.id));
    meldCards(playerId, cards);
    setSelectedCardIds(new Set());
  };

  const handleAutoArrange = () => {
    autoArrangeHand(playerId);
  };

  if (!isCurrentUser) {
    // Render static list for opponents
    return (
      <div className="flex flex-col items-center space-y-2">
        <div className="flex -space-x-8 overflow-x-auto p-4 min-h-[120px]">
          {hand.map((card) => (
            <Card 
              key={card.id} 
              card={card} 
              isFaceUp={false}
              isSelected={false}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-2 w-full">
      <DndContext 
        sensors={sensors} 
        collisionDetection={closestCenter} 
        onDragEnd={handleDragEnd}
      >
        <div className="flex -space-x-8 overflow-x-auto p-4 min-h-[120px] w-full max-w-full touch-pan-x">
          <SortableContext 
            items={hand.map(c => c.id)} 
            strategy={horizontalListSortingStrategy}
          >
            {hand.map((card) => (
              <SortableCard 
                key={card.id} 
                card={card} 
                isFaceUp={true} 
                isSelected={selectedCardIds.has(card.id)}
                onClick={() => toggleSelect(card.id)}
                disabled={!isCurrentUser}
              />
            ))}
          </SortableContext>
        </div>
      </DndContext>
      
      <div className="flex flex-wrap justify-center gap-2 px-2">
        <button 
          onClick={handleAutoArrange}
          className="px-4 py-3 bg-blue-500 text-white rounded-lg shadow-md active:bg-blue-600 touch-manipulation"
          aria-label="Auto Arrange Cards"
        >
          Sort
        </button>
        <button 
          disabled={selectedCardIds.size < 3}
          onClick={handleMeld}
          className="px-4 py-3 bg-green-500 text-white rounded-lg shadow-md disabled:opacity-50 disabled:shadow-none active:bg-green-600 touch-manipulation"
        >
          Meld
        </button>
        <button 
          disabled={selectedCardIds.size !== 1}
          onClick={handleDiscard}
          className="px-4 py-3 bg-red-500 text-white rounded-lg shadow-md disabled:opacity-50 disabled:shadow-none active:bg-red-600 touch-manipulation"
        >
          Discard
        </button>
      </div>
    </div>
  );
};

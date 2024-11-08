'use client';

import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult
} from '@hello-pangea/dnd';
import { ArrowUpDown, CheckCircle, XCircle } from "lucide-react";
import type { OrderingExercise } from "@/types/exercise";

interface OrderingViewerProps {
  exercise: OrderingExercise;
  value: number[];
  onChange: (value: number[]) => void;
  isSubmitted?: boolean;
  feedback?: string;
}

export function OrderingViewer({
  exercise,
  value,
  onChange,
  isSubmitted,
  feedback
}: OrderingViewerProps) {
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || isSubmitted) return;

    const newOrder = Array.from(value);
    const [removed] = newOrder.splice(result.source.index, 1);
    newOrder.splice(result.destination.index, 0, removed);

    onChange(newOrder);
  };

  const isCorrectPosition = (index: number) => {
    return exercise.correctOrder[index] === value[index];
  };

  return (
    <div className="space-y-6">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="items">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="space-y-2"
            >
              {value.map((itemIndex, index) => (
                <Draggable
                  key={itemIndex}
                  draggableId={itemIndex.toString()}
                  index={index}
                  isDragDisabled={isSubmitted}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`flex items-center gap-4 p-4 rounded-lg border ${
                        isSubmitted
                          ? isCorrectPosition(index)
                            ? 'bg-green-50 border-green-200'
                            : 'bg-red-50 border-red-200'
                          : 'bg-background'
                      }`}
                    >
                      <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                      <span className="flex-1">{exercise.items[itemIndex]}</span>
                      {isSubmitted && (
                        isCorrectPosition(index) ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )
                      )}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {isSubmitted && feedback && (
        <div className="mt-4 p-4 bg-secondary rounded-lg">
          <p className="font-medium">Feedback:</p>
          <p>{feedback}</p>
        </div>
      )}
    </div>
  );
}
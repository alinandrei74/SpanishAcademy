'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle, X, ArrowUpDown } from "lucide-react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult
} from '@hello-pangea/dnd';

interface OrderingFormProps {
  value: {
    items: string[];
    correctOrder: number[];
  };
  onChange: (value: any) => void;
}

export function OrderingForm({ value, onChange }: OrderingFormProps) {
  const handleAddItem = () => {
    const newIndex = value.items.length;
    onChange({
      items: [...value.items, ''],
      correctOrder: [...value.correctOrder, newIndex],
    });
  };

  const handleRemoveItem = (index: number) => {
    const newItems = value.items.filter((_, i) => i !== index);
    const newOrder = value.correctOrder
      .filter(n => n !== index)
      .map(n => (n > index ? n - 1 : n));
    onChange({
      items: newItems,
      correctOrder: newOrder,
    });
  };

  const handleItemChange = (index: number, newValue: string) => {
    const newItems = [...value.items];
    newItems[index] = newValue;
    onChange({
      ...value,
      items: newItems,
    });
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const newOrder = Array.from(value.correctOrder);
    const [movedItem] = newOrder.splice(result.source.index, 1);
    newOrder.splice(result.destination.index, 0, movedItem);

    onChange({
      ...value,
      correctOrder: newOrder,
    });
  };

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="space-y-4">
          <Label>Items</Label>
          {value.items.map((item, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="flex-1">
                <Input
                  value={item}
                  onChange={(e) => handleItemChange(index, e.target.value)}
                  placeholder={`Item ${index + 1}`}
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveItem(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={handleAddItem}
            className="w-full"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>

        <div className="space-y-4">
          <Label>Correct Order (Drag to reorder)</Label>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="correct-order">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-2"
                >
                  {value.correctOrder.map((itemIndex, index) => (
                    <Draggable
                      key={itemIndex}
                      draggableId={itemIndex.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="flex items-center gap-4 p-2 bg-secondary rounded-md"
                        >
                          <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                          <span>{value.items[itemIndex]}</span>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </CardContent>
    </Card>
  );
}
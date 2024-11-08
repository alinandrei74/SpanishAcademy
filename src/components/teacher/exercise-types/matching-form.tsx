'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle, X, ArrowRight } from "lucide-react";

interface MatchingFormProps {
  value: {
    pairs: Array<{
      id: string;
      left: string;
      right: string;
    }>;
  };
  onChange: (value: any) => void;
}

export function MatchingForm({ value, onChange }: MatchingFormProps) {
  const handleAddPair = () => {
    onChange({
      ...value,
      pairs: [
        ...value.pairs,
        {
          id: crypto.randomUUID(),
          left: '',
          right: '',
        },
      ],
    });
  };

  const handleRemovePair = (id: string) => {
    onChange({
      ...value,
      pairs: value.pairs.filter(pair => pair.id !== id),
    });
  };

  const handlePairChange = (id: string, side: 'left' | 'right', newValue: string) => {
    onChange({
      ...value,
      pairs: value.pairs.map(pair =>
        pair.id === id ? { ...pair, [side]: newValue } : pair
      ),
    });
  };

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="space-y-4">
          {value.pairs.map((pair, index) => (
            <div key={pair.id} className="flex items-center gap-4">
              <div className="flex-1">
                <Input
                  value={pair.left}
                  onChange={(e) => handlePairChange(pair.id, 'left', e.target.value)}
                  placeholder="Left item"
                />
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <Input
                  value={pair.right}
                  onChange={(e) => handlePairChange(pair.id, 'right', e.target.value)}
                  placeholder="Right item"
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleRemovePair(pair.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={handleAddPair}
          className="w-full"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Matching Pair
        </Button>
      </CardContent>
    </Card>
  );
}
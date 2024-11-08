'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/auth/auth-context';
import { ReviewService } from '@/lib/services/review-service';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ExerciseReview } from '@/components/teacher/exercise-review';
import { FileText, Calendar } from 'lucide-react';

export default function PendingReviewsPage() {
  const { user } = useAuth();
  const [pendingReviews, setPendingReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState<any>(null);

  useEffect(() => {
    loadPendingReviews();
  }, [user]);

  const loadPendingReviews = async () => {
    if (!user) return;
    try {
      const reviews = await ReviewService.getPendingReviews(user.uid);
      setPendingReviews(reviews);
    } catch (error) {
      console.error('Error loading pending reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (submissionId: string, reviewData: any) => {
    if (!user) return;
    
    try {
      await ReviewService.submitReview(submissionId, reviewData, user.uid);
      await loadPendingReviews();
      setSelectedReview(null);
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Pending Reviews</h1>
        <div className="text-sm text-muted-foreground">
          {pendingReviews.length} pending reviews
        </div>
      </div>

      <div className="grid gap-6">
        {pendingReviews.map((review) => (
          <Card key={review.submission.id}>
            <CardHeader>
              <div className="flex justify-between">
                <div>
                  <CardTitle>{review.student.name}</CardTitle>
                  <CardDescription>{review.student.email}</CardDescription>
                </div>
                <Button onClick={() => setSelectedReview(review)}>
                  Review Submission
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span>{review.exercise.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    Submitted {review.submission.submittedAt.toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {pendingReviews.length === 0 && (
          <Card>
            <CardContent className="py-8">
              <div className="text-center text-muted-foreground">
                No pending reviews
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Review Dialog */}
      {selectedReview && (
        <Dialog open={true} onOpenChange={() => setSelectedReview(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Review Submission</DialogTitle>
              <DialogDescription>
                Review submission for {selectedReview.student.name}
              </DialogDescription>
            </DialogHeader>
            <ExerciseReview
              exercise={selectedReview.exercise}
              submission={selectedReview.submission}
              onReviewSubmit={(reviewData) => 
                handleReviewSubmit(selectedReview.submission.id, reviewData)
              }
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
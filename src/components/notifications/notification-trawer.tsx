'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Bell } from 'lucide-react';
import { NotificationService } from '@/lib/services/notification-service';
import type { Notification } from '@/types/notifications';

interface NotificationDrawerProps {
  userId: string;
}

export function NotificationDrawer({ userId }: NotificationDrawerProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const loadNotifications = async () => {
    try {
      const notifs = await NotificationService.getUserNotifications(userId, {
        limit: 50
      });
      setNotifications(notifs);
      setUnreadCount(notifs.filter(n => !n.read).length);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  useEffect(() => {
    if (open) {
      loadNotifications();
    }
  }, [open, userId]);

  const handleNotificationClick = async (notification: Notification) => {
    try {
      if (!notification.read) {
        await NotificationService.markAsRead(notification.id);
        setUnreadCount(prev => prev - 1);
      }

      if (notification.link) {
        router.push(notification.link);
      }

      // Manejar la navegación según el tipo de notificación
      switch (notification.type) {
        case 'review_ready':
          if (notification.data?.submissionId) {
            router.push(`/exercises/submissions/${notification.data.submissionId}`);
          }
          break;
        case 'new_submission':
          if (notification.data?.submissionId) {
            router.push(`/teacher/reviews/${notification.data.submissionId}`);
          }
          break;
        case 'achievement':
          router.push('/profile/achievements');
          break;
        // Añadir más casos según sea necesario
      }
    } catch (error) {
      console.error('Error handling notification:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await NotificationService.markAllAsRead(userId);
      setUnreadCount(0);
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0"
              variant="destructive"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
          <SheetDescription>
            {unreadCount > 0 ? (
              <div className="flex justify-between items-center">
                <span>{unreadCount} unread notifications</span>
                <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead}>
                  Mark all as read
                </Button>
              </div>
            ) : (
              "You're all caught up!"
            )}
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-8rem)] mt-6">
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  notification.read
                    ? 'bg-background'
                    : 'bg-muted'
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start justify-between">
                  <h4 className="font-medium">{notification.title}</h4>
                  <span className="text-xs text-muted-foreground">
                    {new Date(notification.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {notification.message}
                </p>
              </div>
            ))}

            {notifications.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                No notifications
              </div>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
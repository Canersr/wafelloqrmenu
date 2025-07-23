'use client';

import Image from 'next/image';
import type { MenuItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MenuItemCardProps {
  item: MenuItem;
}

export function MenuItemCard({ item }: MenuItemCardProps) {
  const hint = item.aiHint ?? item.name.split(' ').slice(0, 2).join(' ').toLowerCase();
  
  // Use a placeholder if the local image doesn't exist.
  // In a real app, you might want a more robust check.
  const imageUrl = item.imageUrl || 'https://placehold.co/600x400.png';

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full bg-card border-none rounded-xl">
      <CardHeader className="p-0 relative aspect-video">
        <Image
          src={imageUrl}
          alt={item.name}
          fill
          className="object-cover rounded-t-xl"
          data-ai-hint={hint}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={false}
          // Add onError to handle cases where the local image is missing
          onError={(e) => {
            e.currentTarget.src = 'https://placehold.co/600x400.png';
          }}
        />
      </CardHeader>
      <CardContent className="p-4 flex-grow flex flex-col bg-white dark:bg-card">
        <div className="flex-grow">
          <CardTitle className="text-lg font-bold text-card-foreground">{item.name}</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
        </div>
        <p className="font-bold text-lg text-primary text-right mt-4 whitespace-nowrap">
          {item.price.toFixed(2)} TL
        </p>
      </CardContent>
    </Card>
  );
}

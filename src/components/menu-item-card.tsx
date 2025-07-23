'use client';

import Image from 'next/image';
import type { MenuItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MenuItemCardProps {
  item: MenuItem;
}

const getOptimizedCloudinaryUrl = (url: string) => {
  // Check if it's a placeholder URL
  if (!url || !url.includes('res.cloudinary.com/')) {
    return url;
  }
  
  const parts = url.split('/upload/');
  if (parts.length !== 2) {
    return url;
  }
  
  // Apply transformations for optimization
  const transformations = 'w_600,h_400,c_fill,q_auto,f_auto';
  
  return `${parts[0]}/upload/${transformations}/${parts[1]}`;
};

export function MenuItemCard({ item }: MenuItemCardProps) {
  const hint = item.aiHint ?? item.name.split(' ').slice(0, 2).join(' ').toLowerCase();
  const optimizedImageUrl = getOptimizedCloudinaryUrl(item.imageUrl);

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full bg-card border-none rounded-xl">
      <CardHeader className="p-0 relative aspect-video">
        <Image
          src={optimizedImageUrl}
          alt={item.name}
          fill
          className="object-cover rounded-t-xl"
          data-ai-hint={hint}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={false} 
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

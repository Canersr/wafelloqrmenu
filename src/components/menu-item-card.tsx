'use client';

import type { MenuItem } from '@/types';

interface MenuItemCardProps {
  item: MenuItem;
}

export function MenuItemCard({ item }: MenuItemCardProps) {
  return (
    <div className="flex justify-between items-start gap-4">
      <div className="flex-1">
        <h4 className="font-bold text-lg text-foreground">{item.name}</h4>
        <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
      </div>
      <p className="font-bold text-lg text-primary whitespace-nowrap">
        {item.price.toFixed(2)} TL
      </p>
    </div>
  );
}

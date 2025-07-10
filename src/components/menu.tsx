'use client';

import { useMemo, useState } from 'react';
import type { MenuItem } from '@/types';
import { MenuItemCard } from '@/components/menu-item-card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';


interface MenuProps {
  menuItems: MenuItem[];
}

type Category = 'Tümü' | MenuItem['category'];

export function Menu({ menuItems }: MenuProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category>('Tümü');

  const categories = useMemo(() => {
    const uniqueCategories: Category[] = ['Tümü', 'Klasik Waffle', 'Meyveli Waffle', 'Çikolatalı Lezzetler', 'İçecekler'];
    return uniqueCategories;
  }, []);

  const filteredItems = useMemo(() => {
    if (selectedCategory === 'Tümü') {
      return menuItems;
    }
    return menuItems.filter((item) => item.category === selectedCategory);
  }, [menuItems, selectedCategory]);

  return (
    <section id="menu" className="-mt-8 relative z-10">
        <div className="container mx-auto px-4">
            <ScrollArea className="w-full whitespace-nowrap rounded-md mb-8">
              <div className="flex w-max space-x-2 pb-4">
                {categories.map((category) => (
                    <Button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    variant="ghost"
                    className={cn(
                        "rounded-full px-6 transition-colors duration-300 font-semibold",
                        selectedCategory === category
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "bg-card text-card-foreground hover:bg-card/80"
                    )}
                    >
                    {category}
                    </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="invisible" />
            </ScrollArea>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
                <MenuItemCard key={item.id} item={item} />
            ))}
            </div>
      </div>
    </section>
  );
}

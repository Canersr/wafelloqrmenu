'use client';

import { useState, useMemo } from 'react';
import type { MenuItem } from '@/types';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MenuItemCard } from '@/components/menu-item-card';
import { Search, Grid, CupSoda, Cookie } from 'lucide-react';

interface MenuProps {
  menuItems: MenuItem[];
}

const categoryIcons = {
  Waffles: <Grid className="h-5 w-5 mr-2" />,
  Drinks: <CupSoda className="h-5 w-5 mr-2" />,
  Sides: <Cookie className="h-5 w-5 mr-2" />,
};

export function Menu({ menuItems }: MenuProps) {
  const [searchQuery, setSearchQuery] = useState('');
  
  const categories = useMemo(() => ['Waffles', 'Drinks', 'Sides'] as const, []);

  const filteredItems = useMemo(() => {
    if (!searchQuery) return menuItems;
    return menuItems.filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, menuItems]);

  return (
    <section id="menu" className="scroll-mt-20">
      <div className="space-y-8">
        <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold font-headline">Our Menu</h2>
            <p className="text-muted-foreground mt-2">Explore our delicious offerings</p>
        </div>
        
        <div className="max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for an item..."
              className="w-full pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue="Waffles" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto h-auto">
            {categories.map((category) => (
              <TabsTrigger key={category} value={category} className="py-2.5 text-base">
                 {categoryIcons[category]}
                 {category}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category} value={category}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-8">
                {filteredItems
                  .filter((item) => item.category === category)
                  .map((item) => (
                    <MenuItemCard key={item.id} item={item} />
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}

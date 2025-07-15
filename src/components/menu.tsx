'use client';

import { useMemo, useState, useEffect, useCallback } from 'react';
import type { MenuItem } from '@/types';
import { MenuItemCard } from '@/components/menu-item-card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';

interface MenuProps {
  menuItems: MenuItem[];
  categories: string[];
}

export function Menu({ menuItems, categories }: MenuProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('Tümü');

  const onSelect = useCallback((api: CarouselApi) => {
    if (!api) {
      return;
    }
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
  }, []);

  useEffect(() => {
    if (!api) {
      return;
    }

    api.on("select", onSelect);
    api.on("reInit", onSelect);

    // Initial check
    onSelect(api);

    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api, onSelect]);

  useEffect(() => {
    if (!api) {
      return;
    }
    const selectedIndex = categories.findIndex((c) => c === selectedCategory);
    if (selectedIndex !== -1) {
      api.scrollTo(selectedIndex, true); // Add true for instant scroll
    }
  }, [api, selectedCategory, categories]);

  const filteredItems = useMemo(() => {
    if (selectedCategory === 'Tümü') {
      return menuItems;
    }
    return menuItems.filter((item) => item.category === selectedCategory);
  }, [menuItems, selectedCategory]);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };
  
  const handlePreviousClick = useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  const handleNextClick = useCallback(() => {
    api?.scrollNext();
  }, [api]);


  return (
    <section id="menu" className="-mt-8 relative z-10">
      <div className="container mx-auto px-4">
        {categories.length > 1 && (
          <Carousel 
            setApi={setApi} 
            opts={{ align: 'start', slidesToScroll: 'auto', containScroll: 'trimSnaps' }} 
            className="w-full mb-8"
          >
            <div className="relative">
              <CarouselContent className="-ml-2">
                {categories.map((category) => (
                  <CarouselItem key={category} className="pl-2 basis-auto">
                    <Button
                      onClick={() => handleCategoryClick(category)}
                      variant="ghost"
                      className={cn(
                        'rounded-full px-6 transition-colors duration-300 font-semibold',
                        selectedCategory === category
                          ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                          : 'bg-card text-card-foreground hover:bg-card/80'
                      )}
                    >
                      {category}
                    </Button>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {canScrollPrev && <CarouselPrevious onClick={handlePreviousClick} className="absolute left-[-1.5rem]"/>}
              {canScrollNext && <CarouselNext onClick={handleNextClick} className="absolute right-[-1.5rem]" />}
            </div>
          </Carousel>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <MenuItemCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

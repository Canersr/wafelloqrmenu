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
}

type Category = 'Tümü' | MenuItem['category'];

export function Menu({ menuItems }: MenuProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<Category>('Tümü');

  const categories = useMemo(() => {
    const uniqueCategories: Category[] = [
      'Tümü',
      'Klasik Waffle',
      'Meyveli Waffle',
      'Çikolatalı Lezzetler',
      'İçecekler',
    ];
    return uniqueCategories;
  }, []);

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
      api.scrollTo(selectedIndex, true); // Instantly snap
    }
  }, [api, selectedCategory, categories]);

  const filteredItems = useMemo(() => {
    if (selectedCategory === 'Tümü') {
      return menuItems;
    }
    return menuItems.filter((item) => item.category === selectedCategory);
  }, [menuItems, selectedCategory]);

  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category);
  };
  
  const handlePreviousClick = useCallback(() => {
    const currentIndex = categories.findIndex((c) => c === selectedCategory);
    if (currentIndex > 0) {
      const newCategory = categories[currentIndex - 1];
      setSelectedCategory(newCategory);
    }
  }, [categories, selectedCategory]);

  const handleNextClick = useCallback(() => {
    const currentIndex = categories.findIndex((c) => c === selectedCategory);
    if (currentIndex < categories.length - 1) {
      const newCategory = categories[currentIndex + 1];
      setSelectedCategory(newCategory);
    }
  }, [categories, selectedCategory]);


  return (
    <section id="menu" className="-mt-8 relative z-10">
      <div className="container mx-auto px-4">
        <Carousel 
          setApi={setApi} 
          opts={{ align: 'start', slidesToScroll: 1, draggable: false }} 
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <MenuItemCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

'use client';

import { useMemo, useState, useEffect } from 'react';
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

  useEffect(() => {
    if (!api) {
      return;
    }

    const onSelect = (api: CarouselApi) => {
        setCanScrollPrev(api.canScrollPrev());
        setCanScrollNext(api.canScrollNext());
    };

    api.on("select", onSelect);
    api.on("reInit", onSelect);

    // Initial check
    onSelect(api);

    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  useEffect(() => {
    if (!api) {
      return;
    }
    const selectedIndex = categories.findIndex((c) => c === selectedCategory);
    if (selectedIndex !== -1) {
      api.scrollTo(selectedIndex);
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
              {categories.map((category, index) => (
                <CarouselItem key={category} className="pl-2 basis-auto">
                  <Button
                    onClick={() => {
                      handleCategoryClick(category);
                      api?.scrollTo(index);
                    }}
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
            {canScrollPrev && <CarouselPrevious className="absolute left-[-1.5rem]"/>}
            {canScrollNext && <CarouselNext className="absolute right-[-1.5rem]" />}
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

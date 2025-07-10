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
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Skeleton } from './ui/skeleton';

interface MenuProps {
  menuItems: MenuItem[];
}

type Category = string;

export function Menu({ menuItems }: MenuProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [categories, setCategories] = useState<Category[]>(['Tümü']);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState<Category>('Tümü');

  useEffect(() => {
    const fetchCategories = async () => {
      setIsCategoriesLoading(true);
       try {
        const categoriesCollection = collection(db, 'categories');
        const q = query(categoriesCollection, orderBy('name'));
        const querySnapshot = await getDocs(q);
        const fetchedCategories = querySnapshot.docs.map(doc => doc.data().name as string);
        setCategories(['Tümü', ...fetchedCategories]);
      } catch (error) {
        console.error("Error fetching categories: ", error);
        // Silently fail, 'Tümü' will still be available
      } finally {
        setIsCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, [])

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
        {isCategoriesLoading ? (
            <div className="flex space-x-2 mb-8 h-10">
                <Skeleton className="h-full w-20 rounded-full" />
                <Skeleton className="h-full w-28 rounded-full" />
                <Skeleton className="h-full w-32 rounded-full" />
                <Skeleton className="h-full w-24 rounded-full" />
            </div>
        ) : (
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

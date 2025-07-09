'use client';

import { useMemo } from 'react';
import type { MenuItem } from '@/types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { MenuItemCard } from '@/components/menu-item-card';
import { Separator } from './ui/separator';

interface MenuProps {
  menuItems: MenuItem[];
}

export function Menu({ menuItems }: MenuProps) {
  const categories = useMemo(() => {
    const categoryOrder = ['Cajun Menus', 'Bucket Menus', 'Burgers', 'Bowls', 'Pastas', 'Salads', 'Sides', 'Sauces', 'Desserts', 'Drinks'];
    const uniqueCategories = [...new Set(menuItems.map((item) => item.category))];
    return uniqueCategories.sort((a, b) => categoryOrder.indexOf(a) - categoryOrder.indexOf(b));
  }, [menuItems]);

  return (
    <section id="menu" className="scroll-mt-20">
      <div className="space-y-8 max-w-4xl mx-auto">
        <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-headline">Menu</h2>
            <p className="text-muted-foreground mt-2">Explore our delicious offerings</p>
        </div>
        
        <Accordion type="multiple" className="w-full space-y-4">
          {categories.map((category) => (
            <AccordionItem key={category} value={category} className="border-b-0">
              <Card className="bg-secondary/50">
                <CardHeader className="p-0">
                  <AccordionTrigger className="text-2xl font-bold p-6 hover:no-underline">
                    {category}
                  </AccordionTrigger>
                </CardHeader>
                <AccordionContent>
                  <div className="pt-0 p-6 space-y-4">
                  {menuItems
                    .filter((item) => item.category === category)
                    .map((item, index, arr) => (
                      <div key={item.id}>
                        <MenuItemCard item={item} />
                        {index < arr.length - 1 && <Separator className="mt-4" />}
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </Card>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

// Dummy Card components for structure, assuming they exist or are defined elsewhere
const Card = ({ className, children }: { className?: string, children: React.ReactNode }) => <div className={className}>{children}</div>;
const CardHeader = ({ className, children }: { className?: string, children: React.ReactNode }) => <div className={className}>{children}</div>;

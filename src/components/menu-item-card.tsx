'use client';

import Image from 'next/image';
import { Flame, Leaf, ShoppingCart } from 'lucide-react';

import type { MenuItem } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from './ui/separator';

interface MenuItemCardProps {
  item: MenuItem;
}

export function MenuItemCard({ item }: MenuItemCardProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="h-full flex flex-col cursor-pointer hover:shadow-lg transition-shadow duration-300 overflow-hidden group">
          <CardHeader className="p-0">
            <div className="aspect-video overflow-hidden">
              <Image
                src={item.image}
                alt={item.name}
                width={600}
                height={400}
                data-ai-hint={item.aiHint}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          </CardHeader>
          <CardContent className="p-4 flex-grow">
            <CardTitle className="text-lg font-bold font-headline">{item.name}</CardTitle>
            <CardDescription className="text-sm mt-1">{item.description}</CardDescription>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <p className="text-lg font-semibold text-primary">
              ${item.price.toFixed(2)}
            </p>
          </CardFooter>
        </Card>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-[600px]">
        <DialogHeader className="space-y-0">
            <div className="aspect-video overflow-hidden rounded-lg mb-4">
                 <Image
                    src={item.image}
                    alt={item.name}
                    width={600}
                    height={400}
                    data-ai-hint={item.aiHint}
                    className="w-full h-full object-cover"
                 />
            </div>
          <DialogTitle className="text-2xl font-bold font-headline">{item.name}</DialogTitle>
          <DialogDescription className="text-base pt-1">
            {item.description}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className='space-y-2'>
            <h4 className="font-semibold flex items-center gap-2"><Leaf className='h-4 w-4 text-primary' />Ingredients</h4>
            <div className="flex flex-wrap gap-2">
                {item.ingredients.map((ingredient) => (
                    <Badge key={ingredient} variant="secondary">{ingredient}</Badge>
                ))}
            </div>
          </div>
          <Separator />
          <div className='space-y-2'>
            <h4 className="font-semibold flex items-center gap-2"><Flame className='h-4 w-4 text-primary' />Calories</h4>
            <p className="text-sm text-muted-foreground">{item.calories} kcal</p>
          </div>
          <Separator />
          <div className="flex justify-between items-center">
             <p className="text-2xl font-bold text-primary">${item.price.toFixed(2)}</p>
             <Button asChild size="lg">
                <a href="#order-placeholder">
                    <ShoppingCart className="mr-2 h-5 w-5" /> Order Now
                </a>
             </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

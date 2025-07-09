'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { MenuItem } from '@/types';
import { MenuHeader } from '@/components/menu-header';
import { Menu } from '@/components/menu';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenuItems = async () => {
      setLoading(true);
      try {
        const menuItemsCollection = collection(db, 'menuItems');
        const q = query(menuItemsCollection, orderBy('name'));
        const querySnapshot = await getDocs(q);
        const items = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as MenuItem[];
        setMenuItems(items);
      } catch (error) {
        console.error("Error fetching menu items: ", error);
        // Hata durumunda toast mesajı gösterilebilir
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <MenuHeader />
      <main className="flex-1 py-12">
        {loading ? (
          <div className="container mx-auto px-4">
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="overflow-hidden shadow-lg flex flex-col h-full bg-card border-none rounded-xl">
                  <CardHeader className="p-0 relative h-48">
                      <Skeleton className="h-full w-full" />
                  </CardHeader>
                  <CardContent className="p-4 flex-grow flex flex-col bg-white">
                      <div className="flex-grow space-y-2">
                          <Skeleton className="h-6 w-3/4" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-2/3" />
                      </div>
                      <div className="flex justify-end mt-4">
                          <Skeleton className="h-7 w-1/4" />
                      </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : menuItems.length === 0 ? (
            <div className="container mx-auto px-4 text-center">
                <p className="text-muted-foreground">Menüde gösterilecek ürün bulunamadı. Lütfen yönetim panelinden ürün ekleyin.</p>
            </div>
        ) : (
          <Menu menuItems={menuItems} />
        )}
      </main>
    </div>
  );
}

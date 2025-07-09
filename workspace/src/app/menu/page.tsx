'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { MenuItem } from '@/types';
import { MenuHeader } from '@/components/menu-header';
import { Menu } from '@/components/menu';
import { Skeleton } from '@/components/ui/skeleton';

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
                <div key={i} className="space-y-2">
                  <Skeleton className="h-48 w-full rounded-xl" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-6 w-1/4 ml-auto" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <Menu menuItems={menuItems} />
        )}
      </main>
    </div>
  );
}

// src/app/menu/page.tsx
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { MenuItem } from '@/types';
import { MenuHeader } from '@/components/menu-header';
import { Menu } from '@/components/menu';

async function getMenuItems(): Promise<MenuItem[]> {
  try {
    const menuItemsCollection = collection(db, 'menuItems');
    const q = query(menuItemsCollection, orderBy('name'));
    const querySnapshot = await getDocs(q);
    const items = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as MenuItem[];
    return items;
  } catch (error) {
    console.error("Error fetching menu items: ", error);
    // Sunucu tarafında hata oluşursa boş bir menü göster.
    // Gerçek bir uygulamada burada daha detaylı bir hata günlüğü tutulabilir.
    return [];
  }
}

export default async function MenuPage() {
  const menuItems = await getMenuItems();

  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <MenuHeader />
      <main className="flex-1 py-12">
        {/* Veriler sunucuda çekildiği için artık yükleme durumuna gerek yok. */}
        <Menu menuItems={menuItems} />
      </main>
    </div>
  );
}

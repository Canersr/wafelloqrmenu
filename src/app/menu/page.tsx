
import { MenuHeader } from '@/components/menu-header';
import { Menu } from '@/components/menu';
import { allMenuItems, allCategories } from '@/lib/menu-data';

export default function MenuPage() {
  const menuItems = allMenuItems;
  const categories = allCategories;

  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <MenuHeader />
      <main className="flex-1 py-12">
        {menuItems.length === 0 ? (
            <div className="container mx-auto px-4 text-center">
                <p className="text-muted-foreground">Menüde gösterilecek ürün bulunamadı. Lütfen `src/lib/menu-data.ts` dosyasını kontrol edin.</p>
            </div>
        ) : (
          <Menu menuItems={menuItems} categories={categories} />
        )}
      </main>
    </div>
  );
}

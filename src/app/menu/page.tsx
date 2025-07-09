import { MenuHeader } from '@/components/menu-header';
import { Menu } from '@/components/menu';
import { menuItems } from '@/lib/data';

export default function MenuPage() {
  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <MenuHeader />
      <main className="flex-1 py-12">
        <Menu menuItems={menuItems} />
      </main>
    </div>
  );
}

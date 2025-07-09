import { Header } from '@/components/header';
import { AISuggestion } from '@/components/ai-suggestion';
import { Menu } from '@/components/menu';
import { menuItems } from '@/lib/data';

export default function Home() {
  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6 sm:py-8 md:py-12">
        <div className="space-y-12">
          <AISuggestion />
          <Menu menuItems={menuItems} />
        </div>
      </main>
      <footer className="w-full mt-auto text-center p-4">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Wafello. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
}

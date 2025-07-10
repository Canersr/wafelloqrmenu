import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { WaffleLogo } from '@/components/waffle-logo';
import { Button } from '@/components/ui/button';

export function MenuHeader() {
  return (
    <header className="relative w-full py-8 text-foreground">
      <div className="container mx-auto px-4 relative flex flex-col justify-center items-center text-center">
        <Link href="/" className="absolute top-1/2 -translate-y-1/2 left-4 z-10">
          <Button variant="outline" size="icon" className="h-10 w-10 rounded-full">
            <ChevronLeft className="h-6 w-6" />
          </Button>
        </Link>
        <div className="flex items-center justify-center gap-4">
          <WaffleLogo className="w-28 h-28" />
          <h1 className="text-7xl sm:text-8xl font-handwriting text-primary">
            Wafello
          </h1>
        </div>
      </div>
    </header>
  );
}

import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft } from 'lucide-react';
import { WaffleLogo } from '@/components/waffle-logo';
import { Button } from '@/components/ui/button';

export function MenuHeader() {
  return (
    <header className="relative h-48 md:h-56 w-full text-foreground">
      <div className="absolute inset-0">
        <Image
          src="https://placehold.co/1200x400/A1887F/FFFFFF.png"
          alt="Wafello cafe interior"
          fill
          className="object-cover"
          data-ai-hint="cafe interior"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>
      
      <div className="container mx-auto px-4 relative h-full flex flex-col justify-center items-center text-center">
        <Link href="/" className="absolute top-4 left-4 z-10">
          <Button variant="ghost" size="icon" className="h-10 w-10 bg-black/20 hover:bg-black/40 text-white rounded-full">
            <ChevronLeft className="h-6 w-6" />
          </Button>
        </Link>
        <div className="flex flex-col items-center gap-2 text-white">
          <WaffleLogo className="w-20 h-20" />
          <h1 className="text-4xl font-bold" style={{fontFamily: "'Fredoka', sans-serif", fontWeight: 700}}>Wafello</h1>
          <p className="text-base text-white/80">Tatlı Anların Buluşma Noktası</p>
        </div>
      </div>
    </header>
  );
}

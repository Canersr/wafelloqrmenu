import { Button } from '@/components/ui/button';
import { Instagram, Phone, MapPin, Share2 } from 'lucide-react';
import Link from 'next/link';
import { WaffleLogo } from '@/components/waffle-logo';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground font-body">
      <header className="w-full">
        <div className="container mx-auto flex justify-between items-center p-4 text-sm">
          <a href="tel:+905377914662" className="flex items-center gap-2 hover:text-primary transition-colors">
            <Phone size={16} />
            +90 537 791 46 62
          </a>
          <a href="#" className="flex items-center gap-2 text-right hover:text-primary transition-colors">
            <MapPin size={16} />
            <p className="hidden sm:block max-w-[150px] sm:max-w-xs text-right">Sinan mh 1254.sk Aras Bedesteni İşhanı no 18D</p>
          </a>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 -mt-8">
        <div>
          <WaffleLogo className="w-56 h-56 sm:w-64 sm:h-64" />
        </div>

        <h1 className="text-6xl sm:text-7xl font-handwriting text-primary tracking-tight mb-8 -mt-8">
            Wafello
        </h1>
        
        <div className="flex flex-col gap-4 w-full max-w-xs">
          <Button asChild size="lg" className="h-16 text-xl font-bold rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg transform hover:scale-105 transition-transform duration-300">
            <Link href="/menu" prefetch={true}>Menüyü Görüntüle</Link>
          </Button>
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" size="lg" className="h-14 text-lg font-semibold rounded-full border-2 border-primary text-primary bg-background hover:bg-primary/10">
              <MapPin className="mr-2 h-5 w-5"/>
              Konum
            </Button>
            <Button variant="outline" size="lg" className="h-14 text-lg font-semibold rounded-full border-2 border-primary text-primary bg-background hover:bg-primary/10">
              <Share2 className="mr-2 h-5 w-5"/>
              Paylaş
            </Button>
          </div>
        </div>
      </main>

      <footer className="w-full py-6 text-center">
        <div className="flex flex-col items-center gap-2">
          <Button variant="ghost" asChild className="rounded-full w-12 h-12 border border-muted hover:bg-muted/50">
            <a href="#" aria-label='Instagram'>
                <Instagram className="text-muted-foreground" />
            </a>
          </Button>
          <p className="text-sm text-muted-foreground mt-2">Wafello © 2024</p>
        </div>
      </footer>
    </div>
  );
}

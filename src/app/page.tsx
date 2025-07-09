import { Button } from '@/components/ui/button';
import { Instagram, Phone, MapPin, Share2, RefreshCw, Maximize } from 'lucide-react';
import Link from 'next/link';
import { WaffleLogo } from '@/components/waffle-logo';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground font-body">
      {/* Top Bar */}
      <header className="fixed top-0 left-0 right-0 bg-[#1c1c1c] text-white p-2 sm:p-4 z-50">
        <div className="container mx-auto flex justify-between items-center h-full">
          <div className="flex-shrink-0">
            <h1 className="font-bold text-sm sm:text-base">Wafello QR Menu</h1>
            <a href="tel:+905377914662" className="flex items-center gap-2 text-xs sm:text-sm mt-1 text-gray-300 hover:text-white">
              <Phone size={14} />
              +90 537 791 46 62
            </a>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
             <div className="flex items-center gap-2 text-right">
               <MapPin size={16} className="text-gray-300 hidden sm:block" />
               <p className="text-xs text-gray-300 max-w-[150px] sm:max-w-xs text-right">Sinan mh 1254.sk Aras Bedesteni İşhanı no 18D</p>
             </div>
             <div className="flex items-center">
               <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white hover:bg-neutral-700 h-8 w-8 sm:h-10 sm:w-10">
                 <RefreshCw size={18} />
               </Button>
               <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white hover:bg-neutral-700 h-8 w-8 sm:h-10 sm:w-10">
                 <Maximize size={18} />
               </Button>
             </div>
          </div>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col items-center justify-center text-center pt-24 pb-16 px-4">
        <WaffleLogo className="w-36 h-36 sm:w-40 sm:h-40 mb-4" />
        <h2 
          className="text-6xl sm:text-7xl font-bold text-primary" 
          style={{fontFamily: "'Fredoka', sans-serif", fontWeight: 700}}
        >
          Wafello
        </h2>
        <p className="text-muted-foreground text-base sm:text-lg mt-1">Tatlı Anların Buluşma Noktası</p>
        
        <div className="mt-10 flex flex-col gap-3 w-full max-w-xs">
          <Button asChild size="lg" className="h-14 text-lg font-semibold rounded-full bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href="/menu">Menüyü Görüntüle</Link>
          </Button>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" size="lg" className="h-14 text-lg font-semibold rounded-full border-2 border-primary text-primary bg-background hover:bg-primary/10 hover:text-primary">
              <MapPin className="mr-2 h-5 w-5"/>
              Konum
            </Button>
            <Button variant="outline" size="lg" className="h-14 text-lg font-semibold rounded-full border-2 border-primary text-primary bg-background hover:bg-primary/10 hover:text-primary">
              <Share2 className="mr-2 h-5 w-5"/>
              Paylaş
            </Button>
          </div>
        </div>
      </main>

      <footer className="w-full py-6 text-center">
        <div className="flex flex-col items-center gap-2">
          <Button variant="ghost" asChild className="rounded-full w-12 h-12 border border-muted/50 hover:bg-muted/50">
            <a href="#" aria-label='Instagram'>
                <Instagram className="text-muted-foreground" />
            </a>
          </Button>
          <p className="text-sm text-muted-foreground mt-2">Wafello © 2024</p>
        </div>
      </footer>
      
      {/* Bottom Bar */}
       <div className="fixed bottom-0 left-0 right-0 bg-[#1c1c1c] h-6 sm:h-8 z-50"></div>
    </div>
  );
}

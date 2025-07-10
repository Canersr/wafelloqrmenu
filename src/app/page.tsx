
import { Button } from '@/components/ui/button';
import { Instagram, Phone, MapPin, Share2 } from 'lucide-react';
import Link from 'next/link';
import { WaffleLogo } from '@/components/waffle-logo';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';

export default function HomePage() {
  const address = 'Sinan, 1254. Sk. No:18/D, 07170 Muratpaşa/Antalya';
  const encodedAddress = encodeURIComponent(address);
  const googleMapsEmbedUrl = `https://maps.google.com/maps?q=${encodedAddress}&t=&z=17&ie=UTF8&iwloc=&output=embed`;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`

  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground font-body">
      <header className="w-full">
        <div className="container mx-auto flex justify-between items-center p-4 text-sm">
          <a
            href="tel:+905377914662"
            className="flex items-center gap-2 hover:text-primary transition-colors"
          >
            <Phone size={16} />
            +90 537 791 46 62
          </a>
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-right hover:text-primary transition-colors"
          >
            <MapPin size={16} />
            <p className="hidden sm:block max-w-[150px] sm:max-w-xs text-right">
              {address}
            </p>
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
          <Button
            asChild
            size="lg"
            className="h-16 text-xl font-bold rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg transform hover:scale-105 transition-transform duration-300"
          >
            <Link href="/menu" prefetch={true}>
              Menüyü Görüntüle
            </Link>
          </Button>
          <div className="grid grid-cols-2 gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="lg"
                  className="h-14 text-lg font-semibold rounded-full border-2 border-primary text-primary bg-background hover:bg-primary/10"
                >
                  <MapPin className="mr-2 h-5 w-5" />
                  Konum
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[625px] p-0 overflow-hidden">
                <DialogHeader className="p-6 pb-0">
                  <DialogTitle>Konumumuz</DialogTitle>
                  <DialogDescription>{address}</DialogDescription>
                </DialogHeader>
                <div className="relative aspect-[4/3] w-full group">
                  <iframe
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={googleMapsEmbedUrl}
                  ></iframe>
                   <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 cursor-pointer"
                    aria-label="Google Haritalar'da yol tarifi al"
                  >
                    <div className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-sm p-2 rounded-md text-xs text-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Yol tarifi al
                    </div>
                  </a>
                </div>
              </DialogContent>
            </Dialog>

            <Button
              variant="outline"
              size="lg"
              className="h-14 text-lg font-semibold rounded-full border-2 border-primary text-primary bg-background hover:bg-primary/10"
            >
              <Share2 className="mr-2 h-5 w-5" />
              Paylaş
            </Button>
          </div>
        </div>
      </main>

      <footer className="w-full py-6 text-center">
        <div className="flex flex-col items-center gap-2">
          <Button
            variant="ghost"
            asChild
            className="rounded-full w-12 h-12 border border-muted hover:bg-muted/50"
          >
            <a href="#" aria-label="Instagram">
              <Instagram className="text-muted-foreground" />
            </a>
          </Button>
          <p className="text-sm text-muted-foreground mt-2">Wafello © 2024</p>
        </div>
      </footer>
    </div>
  );
}

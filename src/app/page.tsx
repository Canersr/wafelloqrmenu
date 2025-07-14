'use client';

import { Button } from '@/components/ui/button';
import {
  Instagram,
  Phone,
  MapPin,
  Share2,
  QrCode,
  Link as LinkIcon,
  Twitter,
  Facebook,
  MessageCircle,
} from 'lucide-react';
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
import QRCode from 'qrcode.react';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

// Define a type for social media platforms
type SocialPlatform = 'whatsapp' | 'twitter' | 'facebook';

export default function HomePage() {
  const address = 'Sinan, 1254. Sk. No:18/D, 07170 Muratpaşa/Antalya';
  const encodedAddress = encodeURIComponent(address);
  const googleMapsEmbedUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3191.206495392769!2d30.70566367683938!3d36.88517596205908!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14c3913707a2c2b3%3A0x868b7522cfca46e4!2sSinan%2C%201254.%20Sk.%20No%3A18D%2C%2007310%20Muratpa%C5%9Fa%2FAntalya!5e0!3m2!1str!2str!4v1720603700057!5m2!1str!2str`;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  
  // Set the final domain name directly.
  const siteUrl = 'https://wafelloqr.com';

  useEffect(() => {
    // This effect ensures that client-side APIs like `navigator.share` are only checked
    // after the component has mounted on the client.
    setIsClient(true);
  }, []);

  const shareData = {
    title: 'Wafello - The Art of Waffles',
    text: 'Check out the most delicious waffles in town!',
    url: `${siteUrl}/menu`,
  };


  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        // This can happen if the user cancels the share dialog, so we don't need to show an error.
        console.log('Share action was cancelled or failed', error);
      }
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${siteUrl}/menu`);
    toast({
      title: 'Kopyalandı!',
      description: 'Menü linki panoya kopyalandı.',
    });
  };

  const getSocialShareLink = (platform: SocialPlatform, url: string, text: string) => {
    const menuUrl = `${url}/menu`;
    const encodedUrl = encodeURIComponent(menuUrl);
    const encodedText = encodeURIComponent(text);

    switch (platform) {
      case 'whatsapp':
        return `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
      case 'twitter':
        return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;
      case 'facebook':
        return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    }
  };

  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground font-body">
      <header className="w-full py-4"></header>

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

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="lg"
                  className="h-14 text-lg font-semibold rounded-full border-2 border-primary text-primary bg-background hover:bg-primary/10"
                >
                  <Share2 className="mr-2 h-5 w-5" />
                  Paylaş
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Wafello'yu Paylaş</DialogTitle>
                  <DialogDescription>
                    Müşterilerinizin menüye kolayca erişmesi için QR kodu veya linki kullanın.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col items-center gap-6 py-4">
                  <div className="p-4 bg-white rounded-lg border">
                    <QRCode
                      value={`${siteUrl}/menu`}
                      size={160}
                      bgColor="#ffffff"
                      fgColor="#000000"
                      level="Q"
                      includeMargin={false}
                    />
                  </div>
                  <div className="w-full flex flex-col gap-3">
                     <div className="relative flex py-2 items-center">
                        <div className="flex-grow border-t border-muted-foreground/20"></div>
                        <span className="flex-shrink mx-4 text-xs text-muted-foreground">- veya -</span>
                        <div className="flex-grow border-t border-muted-foreground/20"></div>
                    </div>
                     {isClient && navigator.share && (
                        <Button onClick={handleShare} variant="default" size="lg">
                          <Share2 className="mr-2 h-4 w-4" />
                          Cihazın Paylaşım Menüsünü Kullan
                        </Button>
                     )}
                    <div className="grid grid-cols-2 gap-2">
                       <Button variant="outline" asChild>
                         <a href={getSocialShareLink('whatsapp', siteUrl, shareData.text)} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp'ta Paylaş">
                            <MessageCircle /> WhatsApp
                         </a>
                      </Button>
                      <Button variant="outline" asChild>
                         <a href={getSocialShareLink('twitter', siteUrl, shareData.text)} target="_blank" rel="noopener noreferrer" aria-label="Twitter'da Paylaş">
                           <Twitter /> Twitter
                         </a>
                      </Button>
                      <Button variant="outline" asChild>
                         <a href={getSocialShareLink('facebook', siteUrl, shareData.text)} target="_blank" rel="noopener noreferrer" aria-label="Facebook'ta Paylaş">
                           <Facebook /> Facebook
                         </a>
                      </Button>
                       <Button variant="outline" asChild>
                         <a href="https://www.instagram.com/wafelloantalya/" target="_blank" rel="noopener noreferrer" aria-label="Instagram'da bizi ziyaret et">
                           <Instagram /> Instagram
                         </a>
                      </Button>
                    </div>
                    <Button onClick={handleCopyLink} variant="secondary">
                      <LinkIcon className="mr-2 h-4 w-4" />
                      Menü Linkini Kopyala
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </main>

      <footer className="w-full py-6 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-4">
             <Button
                variant="ghost"
                asChild
                className="rounded-full w-12 h-12 border border-muted hover:bg-muted/50"
              >
                <a href="tel:+905377914662" aria-label="Telefon">
                  <Phone className="text-muted-foreground" />
                </a>
              </Button>
            <Button
              variant="ghost"
              asChild
              className="rounded-full w-12 h-12 border border-muted hover:bg-muted/50"
            >
              <a href="https://www.instagram.com/wafelloantalya/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <Instagram className="text-muted-foreground" />
              </a>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">Wafello © 2024</p>
        </div>
      </footer>
    </div>
  );
}

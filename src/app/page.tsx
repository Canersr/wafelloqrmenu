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

// Define a type for social media platforms
type SocialPlatform = 'whatsapp' | 'twitter' | 'facebook';

export default function HomePage() {
  const address = 'Sinan, 1254. Sk. No:18/D, 07170 Muratpaşa/Antalya';
  const encodedAddress = encodeURIComponent(address);
  const googleMapsEmbedUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3191.206495392769!2d30.70566367683938!3d36.88517596205908!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14c3913707a2c2b3%3A0x868b7522cfca46e4!2sSinan%2C%201254.%20Sk.%20No%3A18D%2C%2007310%20Muratpa%C5%9Fa%2FAntalya!5e0!3m2!1str!2str!4v1720603700057!5m2!1str!2str`;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
  const { toast } = useToast();
  const [siteUrl, setSiteUrl] = useState('');

  useEffect(() => {
    // Ensure this runs only on the client where `window` is available
    setSiteUrl(window.location.origin);
  }, []);

  const shareData = {
    title: 'Wafello - The Art of Waffles',
    text: 'Check out the most delicious waffles in town!',
    url: siteUrl,
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      // The dialog will be opened by the DialogTrigger
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(siteUrl);
    toast({
      title: 'Kopyalandı!',
      description: 'Link panoya kopyalandı.',
    });
  };

  const getSocialShareLink = (platform: SocialPlatform, url: string, text: string) => {
    const encodedUrl = encodeURIComponent(url);
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

  const WhatsappIcon = () => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 fill-current"><title>WhatsApp</title><path d="M17.472 14.382c-.297-.149-.88-.436-1.017-.487-.137-.05-.274-.074-.412.074-.138.148-.533.614-.65.738-.118.123-.236.148-.412.05-.177-.1-.747-.274-1.424-.867-.528-.467-.88-.94-.988-1.115-.108-.174-.012-.268.06-.358.062-.08.137-.208.208-.282.07-.075.093-.124.137-.208.044-.083.022-.149-.012-.223-.034-.074-.412-.988-.56-.1352-.149-.364-.253-.314-.412-.314h-.38a.566.566 0 0 0-.583.533c-.001 1.05.38 1.957.435 2.108.056.15.88 1.413 2.13 1.957.288.123.517.187.693.248.33.117.636.1.88.074.288-.03.88-.364 1.002-.712.123-.348.123-.644.083-.712-.04-.07-.162-.117-.253-.162zM12.001 2.002a9.985 9.985 0 0 0-9.982 9.982c0 1.79.463 3.487 1.29 4.938L2.016 22l5.31-1.378a9.952 9.952 0 0 0 4.675 1.182h.004a9.985 9.985 0 0 0 9.982-9.983 9.985 9.985 0 0 0-9.982-9.982z"/></svg>
  );

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

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="lg"
                  className="h-14 text-lg font-semibold rounded-full border-2 border-primary text-primary bg-background hover:bg-primary/10"
                  onClick={handleShare}
                >
                  <Share2 className="mr-2 h-5 w-5" />
                  Paylaş
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Wafello'yu Paylaş</DialogTitle>
                  <DialogDescription>
                    Bu QR kodu okutarak veya aşağıdaki linklerle arkadaşlarını davet et!
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col items-center gap-6 py-4">
                  <div className="p-4 bg-white rounded-lg border">
                    {siteUrl && (
                      <QRCode
                        value={siteUrl}
                        size={160}
                        bgColor="#ffffff"
                        fgColor="#000000"
                        level="Q"
                        includeMargin={false}
                      />
                    )}
                  </div>
                  <div className="w-full flex flex-col gap-3">
                     <p className="text-sm text-center text-muted-foreground">- veya -</p>
                    <div className="grid grid-cols-3 gap-2">
                       <Button variant="outline" asChild>
                         <a href={getSocialShareLink('whatsapp', shareData.url, shareData.text)} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp'ta Paylaş">
                            <WhatsappIcon />
                         </a>
                      </Button>
                      <Button variant="outline" asChild>
                         <a href={getSocialShareLink('twitter', shareData.url, shareData.text)} target="_blank" rel="noopener noreferrer" aria-label="Twitter'da Paylaş">
                           <Twitter />
                         </a>
                      </Button>
                      <Button variant="outline" asChild>
                         <a href={getSocialShareLink('facebook', shareData.url, shareData.text)} target="_blank" rel="noopener noreferrer" aria-label="Facebook'ta Paylaş">
                           <Facebook />
                         </a>
                      </Button>
                    </div>
                    <Button onClick={handleCopyLink} variant="secondary">
                      <LinkIcon className="mr-2 h-4 w-4" />
                      Linki Kopyala
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
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
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <Instagram className="text-muted-foreground" />
            </a>
          </Button>
          <p className="text-sm text-muted-foreground mt-2">Wafello © 2024</p>
        </div>
      </footer>
    </div>
  );
}

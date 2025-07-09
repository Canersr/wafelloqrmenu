import { UtensilsCrossed, Instagram, Phone, MapPin } from 'lucide-react';
import { Button } from './ui/button';

export function Header() {
  return (
    <header className="py-6 border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 flex flex-col items-center text-center gap-4">
        <div className="flex flex-col items-center gap-2">
          <UtensilsCrossed className="h-12 w-12 text-primary" />
          <h1 className="text-4xl font-extrabold font-headline text-foreground tracking-tight">
            Wafello
          </h1>
          <p className="text-muted-foreground">Welcome to the Art of Waffles!</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <a href="#" aria-label="Instagram">
              <Instagram className="h-5 w-5" />
            </a>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <a href="#" aria-label="Phone">
              <Phone className="h-5 w-5" />
            </a>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <a href="#" aria-label="Location">
              <MapPin className="h-5 w-5" />
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}

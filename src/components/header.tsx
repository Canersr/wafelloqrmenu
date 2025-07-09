import { Grid } from 'lucide-react';

export function Header() {
  return (
    <header className="py-4 border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2">
          <Grid className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold font-headline text-foreground">
            Wafello
          </h1>
        </div>
      </div>
    </header>
  );
}

import type {Metadata} from 'next';
import { Fredoka, Pacifico } from 'next/font/google';
import { Toaster } from "@/components/ui/toaster"
import './globals.css';

const fredoka = Fredoka({ 
  subsets: ['latin'], 
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-fredoka' 
});

const pacifico = Pacifico({
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
  variable: '--font-pacifico'
});

export const metadata: Metadata = {
  title: 'Wafello - The Art of Waffles',
  description: 'The most delicious waffles in town!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={`${fredoka.variable} ${pacifico.variable} font-body antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}

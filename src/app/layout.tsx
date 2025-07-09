import type {Metadata} from 'next';
import { Fredoka } from 'next/font/google';
import { Toaster } from "@/components/ui/toaster"
import './globals.css';

const fredoka = Fredoka({ subsets: ['latin'], variable: '--font-fredoka' });

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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={`${fredoka.variable} font-body antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}

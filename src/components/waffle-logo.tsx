import Image from 'next/image';
import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function WaffleLogo({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  // Reverted to the original URL to ensure the logo is visible.
  const logoUrl = "https://res.cloudinary.com/dxwwviisy/image/upload/v1752131673/wafello_logo_swjlyq.jpg";
  
  return (
    <div className={cn("relative", className)} {...props}>
        <Image
          src={logoUrl}
          alt="Wafello Logo"
          fill
          className="object-contain"
          priority
        />
    </div>
  );
}

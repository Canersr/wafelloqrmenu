import Image from 'next/image';
import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function WaffleLogo({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  // By adding 'e_background_removal' to the URL, we ask Cloudinary to make the background transparent.
  const logoUrl = "https://res.cloudinary.com/dxwwviisy/image/upload/e_background_removal/v1752131673/wafello_logo_swjlyq.jpg";
  
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

import Image from 'next/image';
import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function WaffleLogo({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  const logoUrl = "https://res.cloudinary.com/dxwwviisy/image/upload/v1753355292/wafello_logo_ntgqw9.png";
  
  return (
    <div className={cn("relative", className)} {...props}>
        <Image
          src={logoUrl}
          alt="Wafello Logo"
          fill
          className="object-contain pointer-events-none"
          priority
          draggable="false"
        />
    </div>
  );
}

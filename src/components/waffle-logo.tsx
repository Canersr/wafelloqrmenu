import Image from 'next/image';
import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function WaffleLogo({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("relative", className)} {...props}>
        <Image
          src="https://res.cloudinary.com/dxwwviisy/image/upload/v1752131673/wafello_logo_swjlyq.jpg"
          alt="Wafello Logo"
          width={160}
          height={160}
          className="rounded-full"
          priority
        />
    </div>
  );
}

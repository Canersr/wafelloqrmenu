import type { SVGProps } from 'react';

export function WaffleLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 160 160"
      width="160"
      height="160"
      {...props}
    >
      <circle cx="80" cy="80" r="80" fill="#facc15" />
      <g transform="translate(30, 30)">
        <rect width="100" height="100" rx="10" ry="10" fill="#d97706" />
        <g stroke="#f59e0b" strokeWidth="4">
          <line x1="20" y1="0" x2="20" y2="100" />
          <line x1="40" y1="0" x2="40" y2="100" />
          <line x1="60" y1="0" x2="60" y2="100" />
          <line x1="80" y1="0" x2="80" y2="100" />
          <line x1="0" y1="20" x2="100" y2="20" />
          <line x1="0" y1="40" x2="100" y2="40" />
          <line x1="0" y1="60" x2="100" y2="60" />
          <line x1="0" y1="80" x2="100" y2="80" />
        </g>
        <circle cx="35" cy="40" r="5" fill="#4f3f32" />
        <circle cx="65" cy="40" r="5" fill="#4f3f32" />
        <path
          d="M 35 60 A 15 15 0 0 0 65 60"
          stroke="#4f3f32"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

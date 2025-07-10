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
      <circle cx="80" cy="80" r="78" fill="#facc15" stroke="#4f3f32" strokeWidth="4" />
      <g transform="translate(18, 25) scale(0.9)">
        {/* Waffle Body */}
        <path d="M49,15.2C49,10.1,53.1,6,58.2,6h25.5c5.1,0,9.2,4.1,9.2,9.2v50.5c0,5.1-4.1,9.2-9.2,9.2H58.2c-5.1,0-9.2-4.1-9.2-9.2V15.2Z" fill="#d97706" stroke="#a16207" strokeWidth="2"/>

        {/* Syrup */}
        <path d="M103.5,35.5c-2.3-10.4-11.8-18-23.5-18s-21.2,7.6-23.5,18c-3.8,1.3-6.5,5-6.5,9.5,0,5.5,4.5,10,10,10,0,0,1.5,0,2.5,0,0.5,8.8,7.6,15.5,17.5,15.5s17-6.7,17.5-15.5c1,0,2.5,0,2.5,0,5.5,0,10-4.5,10-10,0-4.5-2.7-8.2-6.5-9.5Z" fill="#fbbf24"/>
        <path d="M72 70.5c-3-3-3.8-9.2 0-12" stroke="#f59e0b" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M79.5 70c-4-3-4-9 0-12" stroke="#f59e0b" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M86.5 68c-4-3-4-9 0-12" stroke="#f59e0b" strokeWidth="3" fill="none" strokeLinecap="round" />

        {/* Waffle Grid */}
        <g stroke="#a16207" strokeWidth="2.5" strokeLinecap="round">
            <line x1="64" x2="64" y1="8" y2="73"/>
            <line x1="79" x2="79" y1="8" y2="73"/>
            <line x1="51" x2="91" y1="20" y2="20"/>
            <line x1="51" x2="91" y1="35" y2="35"/>
            <line x1="51" x2="91" y1="50" y2="50"/>
            <line x1="51" x2="91" y1="65" y2="65"/>
        </g>
        
        {/* Dripping Syrup */}
        <path d="M80,70.5 C78,75.5 82,75.5 80,82.5 C78,87.5 82,87.5 80,92.5" fill="#fbbf24" stroke="#f59e0b" strokeWidth="1" />
        <circle cx="80" cy="95.5" r="4" fill="#fbbf24" />

        {/* Arms */}
        <path d="M49,30 C35,25 30,35 20,45" fill="none" stroke="#d97706" strokeWidth="8" strokeLinecap="round"/>
        <path d="M93,30 C107,25 112,35 122,45" fill="none" stroke="#d97706" strokeWidth="8" strokeLinecap="round"/>

        {/* Hands */}
        <path d="M16,40 C10,35 12,55 22,50Z" fill="white" stroke="black" strokeWidth="1"/>
        <path d="M126,40 C132,35 130,55 120,50Z" fill="white" stroke="black" strokeWidth="1"/>

        {/* Eyes */}
        <ellipse cx="70" cy="42" rx="6" ry="9" fill="#fff" stroke="#4f3f32" strokeWidth="1.5"/>
        <circle cx="72" cy="40" r="3" fill="#0077be"/>
        <circle cx="73" cy="38" r="1.5" fill="#fff"/>
        <ellipse cx="90" cy="42" rx="6" ry="9" fill="#fff" stroke="#4f3f32" strokeWidth="1.5"/>
        <circle cx="92" cy="40" r="3" fill="#0077be"/>
        <circle cx="93" cy="38" r="1.5" fill="#fff"/>
        
        {/* Mouth */}
        <path d="M75,55 Q80,62 85,55" fill="#c1272d" stroke="#4f3f32" strokeWidth="1"/>
        <path d="M77,55 Q80,59 83,55" fill="#fff" />
      </g>
      
      {/* Text */}
      <text x="80" y="125" fontFamily="'Fredoka', sans-serif" fontWeight="700" fontSize="28" fill="white" textAnchor="middle" stroke="#a16207" strokeWidth="1.5" strokeLinejoin="round">WAFELLO</text>
      <text x="80" y="148" fontFamily="'Fredoka', sans-serif" fontWeight="500" fontSize="16" fill="white" textAnchor="middle" stroke="#a16207" strokeWidth="0.5" strokeLinejoin="round">WAFFLE</text>
    </svg>
  );
}

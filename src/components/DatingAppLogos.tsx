import React from 'react';

// Tinder Logo SVG Component
export const TinderLogo = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8.667 8.44c0-2.52 1.627-4.44 3.666-4.44 2.04 0 3.667 1.92 3.667 4.44 0 1.96-1.334 3.56-3 4.16V20c0 .55-.447 1-1 1s-1-.45-1-1v-7.4c-1.666-.6-3-2.2-3-4.16z" fill="#FD5068"/>
    <circle cx="12" cy="6" r="2" fill="#FD5068"/>
  </svg>
);

// Bumble Logo SVG Component  
export const BumbleLogo = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4 14H8v-2h8v2zm0-4H8v-2h8v2zm0-4H8V6h8v2z" fill="#FFDD00"/>
  </svg>
);

// Hinge Logo SVG Component
export const HingeLogo = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z" fill="#A200FF"/>
    <path d="M9 12h6v2H9v-2zm0-3h6v2H9V9z" fill="white"/>
  </svg>
);

// Coffee Meets Bagel Logo SVG Component
export const CoffeeMeetsBagelLogo = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="#8B4513"/>
    <circle cx="12" cy="12" r="6" fill="#D2B48C"/>
    <circle cx="10" cy="10" r="1" fill="#8B4513"/>
    <circle cx="14" cy="10" r="1" fill="#8B4513"/>
    <path d="M9 14c0 1.66 1.34 3 3 3s3-1.34 3-3" stroke="#8B4513" strokeWidth="1" fill="none"/>
  </svg>
);

// OkCupid Logo SVG Component
export const OkCupidLogo = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="20" height="20" rx="4" fill="#1E90FF"/>
    <path d="M8 8h8v2H8V8zm0 4h6v2H8v-2z" fill="white"/>
    <circle cx="12" cy="16" r="2" fill="white"/>
  </svg>
);

// Match Logo SVG Component
export const MatchLogo = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="#00A651"/>
    <path d="M12 6l2 6h6l-5 4 2 6-5-4-5 4 2-6-5-4h6l2-6z" fill="white"/>
  </svg>
);
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary:  { DEFAULT:'#1a73e8', dark:'#1557b0', light:'#e8f0fe' },
        success:  { DEFAULT:'#1e8e3e', light:'#e6f4ea' },
        danger:   { DEFAULT:'#d93025', light:'#fce8e6' },
        warning:  { DEFAULT:'#f29900', light:'#fef7e0' },
        surface:  '#ffffff',
        muted:    '#9aa0a6',
        subtle:   '#5f6368',
        body:     '#202124',
        border:   '#e0e0e0',
        bg:       '#f8f9fa',
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      boxShadow: {
        card:  '0 1px 4px rgba(60,64,67,0.08)',
        hover: '0 4px 20px rgba(60,64,67,0.16)',
        glow:  '0 0 0 3px rgba(26,115,232,0.18)',
      },
      animation: {
        'fade-in':    'fadeIn 0.4s ease both',
        'slide-up':   'slideUp 0.4s cubic-bezier(.16,1,.3,1) both',
        'slide-in':   'slideIn 0.35s cubic-bezier(.16,1,.3,1) both',
        'spin-slow':  'spin 1s linear infinite',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'bounce-in':  'bounceIn 0.5s cubic-bezier(.175,.885,.32,1.275) both',
      },
      keyframes: {
        fadeIn:    { from:{ opacity:0 }, to:{ opacity:1 } },
        slideUp:   { from:{ opacity:0, transform:'translateY(20px)' }, to:{ opacity:1, transform:'translateY(0)' } },
        slideIn:   { from:{ opacity:0, transform:'translateX(-16px)' }, to:{ opacity:1, transform:'translateX(0)' } },
        pulseSoft: { '0%,100%':{ opacity:1 }, '50%':{ opacity:.6 } },
        bounceIn:  { from:{ opacity:0, transform:'scale(.85)' }, to:{ opacity:1, transform:'scale(1)' } },
      },
      transitionTimingFunction: { smooth:'cubic-bezier(.16,1,.3,1)' },
    },
  },
  plugins: [],
};

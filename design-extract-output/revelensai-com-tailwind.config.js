/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
    colors: {
        'neutral-50': '#ffffff',
        'neutral-100': '#262626',
        'neutral-200': '#000000',
        'neutral-300': '#171717',
        background: '#000000',
        foreground: '#ffffff'
    },
    fontFamily: {
        body: [
            'Times',
            'sans-serif'
        ]
    },
    fontSize: {
        '12': [
            '12px',
            {
                lineHeight: '16px'
            }
        ],
        '14': [
            '14px',
            {
                lineHeight: '20px'
            }
        ],
        '16': [
            '16px',
            {
                lineHeight: '24px'
            }
        ]
    },
    spacing: {
        '2': '4px',
        '16': '32px',
        '57px': '57px'
    },
    borderRadius: {
        sm: '4px',
        lg: '12px'
    },
    boxShadow: {
        sm: 'rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px',
        lg: 'rgba(0, 0, 0, 0.45) 0px 8px 24px 0px, rgba(0, 0, 0, 0.3) 0px 2px 8px 0px'
    },
    screens: {
        xs: '360px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '1400px': '1400px'
    },
    transitionDuration: {
        '150': '0.15s',
        '1000': '1s'
    },
    transitionTimingFunction: {
        custom: 'cubic-bezier(0.4, 0, 0.2, 1)'
    }
},
  },
};

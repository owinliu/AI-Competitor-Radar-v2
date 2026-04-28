// React Theme — extracted from https://revelensai.com/reports/task/4605d41f-97b3-48df-ae16-3ea7c5810511
// Compatible with: Chakra UI, Stitches, Vanilla Extract, or any CSS-in-JS

/**
 * TypeScript type definition for this theme:
 *
 * interface Theme {
 *   colors: {
    background: string;
    foreground: string;
    neutral50: string;
    neutral100: string;
    neutral200: string;
    neutral300: string;
 *   };
 *   fonts: {
    body: string;
 *   };
 *   fontSizes: {
    '12': string;
    '14': string;
    '16': string;
 *   };
 *   space: {
    '4': string;
    '32': string;
    '57': string;
 *   };
 *   radii: {
    sm: string;
    lg: string;
 *   };
 *   shadows: {
    sm: string;
    lg: string;
 *   };
 *   states: {
 *     hover: { opacity: number };
 *     focus: { opacity: number };
 *     active: { opacity: number };
 *     disabled: { opacity: number };
 *   };
 * }
 */

export const theme = {
  "colors": {
    "background": "#000000",
    "foreground": "#ffffff",
    "neutral50": "#ffffff",
    "neutral100": "#262626",
    "neutral200": "#000000",
    "neutral300": "#171717"
  },
  "fonts": {
    "body": "'Times', sans-serif"
  },
  "fontSizes": {
    "12": "12px",
    "14": "14px",
    "16": "16px"
  },
  "space": {
    "4": "4px",
    "32": "32px",
    "57": "57px"
  },
  "radii": {
    "sm": "4px",
    "lg": "12px"
  },
  "shadows": {
    "sm": "rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px",
    "lg": "rgba(0, 0, 0, 0.45) 0px 8px 24px 0px, rgba(0, 0, 0, 0.3) 0px 2px 8px 0px"
  },
  "states": {
    "hover": {
      "opacity": 0.08
    },
    "focus": {
      "opacity": 0.12
    },
    "active": {
      "opacity": 0.16
    },
    "disabled": {
      "opacity": 0.38
    }
  }
};

// MUI v5 theme
export const muiTheme = {
  "palette": {
    "background": {
      "default": "#000000",
      "paper": "#000000"
    },
    "text": {
      "primary": "#ffffff",
      "secondary": "#fafafa"
    }
  },
  "typography": {
    "fontFamily": "'Times', sans-serif",
    "body1": {
      "fontSize": "16px",
      "fontWeight": "400",
      "lineHeight": "24px"
    },
    "body2": {
      "fontSize": "12px",
      "fontWeight": "500",
      "lineHeight": "16px"
    }
  },
  "shape": {
    "borderRadius": 4
  },
  "shadows": [
    "rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0px 1px 2px -1px",
    "rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px",
    "rgba(0, 0, 0, 0.45) 0px 8px 24px 0px, rgba(0, 0, 0, 0.3) 0px 2px 8px 0px"
  ]
};

export default theme;

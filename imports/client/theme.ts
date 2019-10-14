/* eslint-disable @typescript-eslint/interface-name-prefix */
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import { Palette, PaletteOptions, PaletteColor } from '@material-ui/core/styles/createPalette';
import { Spacing } from '@material-ui/core/styles/createSpacing';
import { Breakpoints } from '@material-ui/core/styles/createBreakpoints';
import { Typography } from '@material-ui/core/styles/createTypography';
import { Transitions } from '@material-ui/core/styles';

declare module '@material-ui/styles' {
  interface DefaultTheme {
    spacing: Spacing;
    breakpoints: Breakpoints;
    transitions: Transitions;
    sizes: {
      menuItem: React.CSSProperties['width'];
    };
    palette: {
      primary: PaletteColor;
      secondary: PaletteColor;
      darken: PaletteColor;
    };
    typography: Typography;
  }
}

declare module '@material-ui/core/styles/createPalette' {
  interface TypeBackground {
    page: string;
  }
  interface FontColor {
    subtle: string;
    lighter: string;
    light: string;
    main: string;
  }
  interface SimplePaletteColorOptions {
    subtle?: string;
    lighter?: string;
    medium?: string;
    darker?: string;
  }
  interface PaletteColor {
    subtle: string;
    lighter: string;
    medium: string;
    darker: string;
  }
  interface Palette {
    background: TypeBackground;
    darken: PaletteColor;
    font: {
      black: FontColor;
      primary: FontColor;
      secondary: FontColor;
      white: FontColor;
    };
  }
  interface PaletteOptions {
    darken?: PaletteColorOptions;
    font?: {
      black?: FontColor;
      primary?: FontColor;
      secondary?: FontColor;
      white?: FontColor;
    };
  }
}

declare module '@material-ui/core/styles/createMuiTheme' {
  interface Theme {
    palette: Palette;
  }

  // allow configuration using `createMuiTheme`
  interface ThemeOptions {
    sizes?: {
      menuItem?: React.CSSProperties['width'];
    };
    palette?: PaletteOptions;
  }
}

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#f05545',
      main: '#b71c1c',
      dark: '#7f0000',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ffc780', // #ffc046',
      main: '#ff8f00',
      dark: '#c56000',
      contrastText: '#000',
    },
    darken: {
      subtle: '#0001',
      lighter: '#0002',
      light: '#0003',
      medium: '#0004',
      dark: '#0006',
      darker: '#0008',
      main: '#000',
    },
    background: {
      page: '#f3ece4',
      paper: '#fff',
      default: '#fafafa',
    },
    font: {
      black: {
        subtle: '#bdbdbd',
        lighter: '#757575',
        light: '#656565',
        main: 'black',
      },
    },
  },
  typography: {
    // Tell Material-UI what's the font-size on the html element is.
    htmlFontSize: 10,
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    h1: {
      fontSize: '4rem',
    },
    h2: {
      fontSize: '3rem',
    },
    h3: {
      fontSize: '2.5rem',
    },
    h4: {
      fontSize: '2.2rem',
    },
    h5: {
      fontSize: '1.9rem',
    },
    h6: {
      fontSize: '1.6rem',
    },
  },
  sizes: {
    menuItem: '7rem',
  },
});

export default theme;

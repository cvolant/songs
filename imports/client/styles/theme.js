import { createMuiTheme } from '@material-ui/core/styles';

export default theme = createMuiTheme({
    palette: {
        primary: {
            light: '#f05545',
            main: '#b71c1c',
            dark: '#7f0000',
            contrastText: '#fff',
        },
        secondary: {
            light: '#ffc046',
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
        }
    },
    typography: {
        // Tell Material-UI what's the font-size on the html element is.
        htmlFontSize: 10,
        useNextVariants: true,
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
    }
});
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
    },
    typography: {
        // Tell Material-UI what's the font-size on the html element is.
        htmlFontSize: 10,
        useNextVariants: true,
        // Use the system font instead of the default Roboto font.
/*         fontFamily: [
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
        ].join(','), */
/*         h1: {
            fontSize: '1.8rem',
        },
        h2: {
            fontSize: '1.6rem',
        },
        h3: {
            fontSize: '1.4rem',
        },
        h4: {
            fontSize: '1.2rem',
        }, */
    },
});
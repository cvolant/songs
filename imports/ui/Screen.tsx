import React, { useState, useEffect } from 'react';

import { makeStyles, CSSProperties } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import Add from '@material-ui/icons/Add';
import Clear from '@material-ui/icons/Clear';
import Remove from '@material-ui/icons/Remove';

const useStyles = makeStyles((theme) => ({
  bottomFab: {
    bottom: 0,
    right: 0,
    margin: theme.spacing(1),
    position: 'absolute',
    zIndex: 11,

    '& button': {
      background: '#888',
      color: 'black',
      float: 'right',
      margin: theme.spacing(1),
      opacity: 0.4,

      '& svg': {
        width: '3rem',
        height: '3rem',
      },
    },
    '& button:hover': {
      background: '#888',
      color: 'black',
      opacity: 0.7,
    },
    '& button:focus': {
      background: 'black',
      color: '#888',
      opacity: 0.4,
    },
    '& button:disabled': {
      background: '#999',
      color: '#888',
      opacity: 0.4,
    },
  },
  closeScreen: {
    background: '#888',
    height: '3.5rem',
    margin: theme.spacing(3),
    minWidth: 0,
    opacity: 0.4,
    padding: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    width: '3.5rem',
    zIndex: 11,

    '&:hover': {
      background: '#888',
      opacity: 0.7,
    },
  },
  displayZone: {
    height: '100%',
    position: 'relative',
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1),
    },
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(4),
    },
    [theme.breakpoints.up('lg')]: {
      padding: theme.spacing(6),
    },
    overflowY: 'scroll',
    scrollbarWidth: 'none',
    textAlign: 'left',
    WebkitOverflowScrolling: 'touch',
  } as CSSProperties,
  screen: (({ opacity }: { opacity: number }) => ({
    background: 'black',
    color: 'white',
    height: '100%',
    left: 0,
    padding: 0,
    position: 'fixed',
    opacity,
    textAlign: 'center',
    top: 0,
    transition: theme.transitions.create('opacity', { duration: theme.transitions.duration.complex }),
    width: '100%',
    zIndex: 2000,
  })) as () => CSSProperties,
  under: {
    clear: 'both',
  },
}));

interface IScreenProps {
  print: (zoom: number) => JSX.Element;
  closeScreen: () => void;
}

export const Screen: React.FC<IScreenProps> = ({
  print, closeScreen,
}) => {
  const [opacity, setOpacity] = useState(0);

  // eslint-disable-next-line no-undef
  const definedLocalStorage = localStorage as {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getItem: (property: string) => any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setItem: (property: string, value: any) => void;
  };

  const [zoom, setStateZoom] = useState(parseFloat(definedLocalStorage.getItem('zoom')));
  useEffect(() => {
    setTimeout(() => setOpacity(1), 10);
  }, [print]);

  const setZoom = (newZoom: number): void => {
    definedLocalStorage.setItem('zoom', newZoom);
    setStateZoom(newZoom);
  };

  const close = (): void => {
    setOpacity(0);
    setTimeout(() => closeScreen(), 1550);
  };

  const classes = useStyles({ opacity, zoom });

  return (
    <div className={classes.screen}>

      <Button
        variant="contained"
        size="small"
        className={classes.closeScreen}
        onClick={close}
      >
        <Clear />
      </Button>

      <div className={classes.bottomFab}>
        <Fab
          disabled={zoom >= 2.4}
          onClick={(): void => setZoom(zoom * 1.2)}
        >
          <Add />
        </Fab>
        <Fab
          className={classes.under}
          disabled={zoom <= 0.4}
          onClick={(): void => setZoom(zoom / 1.2)}
        >
          <Remove />
        </Fab>
      </div>

      <div className={classes.displayZone}>
        {print(zoom)}
      </div>
    </div>
  );
};

export default Screen;

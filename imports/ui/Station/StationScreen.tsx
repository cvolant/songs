import React, { useState, useEffect } from 'react';

import { makeStyles, CSSProperties } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import Add from '@material-ui/icons/Add';
import Clear from '@material-ui/icons/Clear';
import Remove from '@material-ui/icons/Remove';

const useStyles = makeStyles(() => ({
  stationScreen: {
    display: 'flex',
    flexDirection: 'column',
  },
}));

interface IStationScreenProps {
  print: (zoom: number) => JSX.Element;
  closeScreen: () => void;
}

export const StationScreen: React.FC<IStationScreenProps> = ({
  print, closeScreen,
}) => {
  // eslint-disable-next-line no-undef
  const definedLocalStorage = localStorage as {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getItem: (property: string) => any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setItem: (property: string, value: any) => void;
  };

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
    <div className={classes.stationScreen}>
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
    </div>
  );
};

export default StationScreen;

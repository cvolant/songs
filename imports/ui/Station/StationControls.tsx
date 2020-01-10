import React from 'react';

import { makeStyles } from '@material-ui/styles';

import { IUnfetched, IBroadcast } from '../../types';

const useStyles = makeStyles(() => ({
  stationControls: {
    display: 'flex',
  },
}));

interface IStationControlsProps {
  broadcast: IUnfetched<IBroadcast>;
}

export const StationControls: React.FC<IStationControlsProps> = ({ broadcast }) => {
  const classes = useStyles();

  const rights = broadcast
    && broadcast.addresses
    && broadcast.addresses[0]
    && broadcast.addresses[0].rights;

  if (!rights || rights === 'readOnly') {
    return null;
  }

  return (
    <div className={classes.stationControls} />
  );
};

export default StationControls;

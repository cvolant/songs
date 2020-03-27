import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import AnimatedLogo from './AnimatedLogo';

const useStyles = makeStyles((theme) => {
  const radius = 10;
  return ({
    background: {
      background: theme.palette.background.page,
      height: '100vh',
      position: 'fixed',
      width: '100vw',
    },
    logo: {
      height: `${2 * radius}rem`,
      left: '50%',
      margin: `-${radius}rem 0 0 -${radius}rem`,
      position: 'absolute',
      top: '50%',
      width: `${2 * radius}rem`,
    },
  });
});

export const Loading: React.FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.background}>
      <AnimatedLogo className={classes.logo} />
    </div>
  );
};

export default Loading;

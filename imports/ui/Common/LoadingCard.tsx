import React from 'react';
import clsx from 'clsx';

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';

const useStyles = makeStyles((theme) => ({
  loadingCard: {
    height: ({ height }: { height: string }): string => height,
    margin: theme.spacing(1),
    width: '100%',
    opacity: 0.2,
  },
}));

interface ILoadingCard {
  height: string;
  className?: string;
}

const LoadingCard: React.FC<ILoadingCard> = ({
  height = '10rem',
  className,
}) => {
  const classes = useStyles({ height });

  return <Card className={clsx(classes.loadingCard, className)} />;
};

export default LoadingCard;

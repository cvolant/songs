import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Skeleton from '@material-ui/lab/Skeleton';

const useStyles = makeStyles((theme) => ({
  card: {
    height: '100%',
    margin: theme.spacing(1),
    width: '100%',
  },
  shortLine: {
    width: '60%',
  },
}));

const LoadingParagraph: React.FC = () => {
  const classes = useStyles();

  return (
    <Card className={classes.card} elevation={0} raised={false}>
      <CardHeader title={<Skeleton className={classes.shortLine} height="1.7rem" />} />
      <CardContent>
        {[1, 2, 3, 4, 5, 6].map((llIndex) => (
          <Skeleton key={`loading-line-${llIndex}`} height="1.5rem" />
        ))}
        <Skeleton className={classes.shortLine} height="1.5rem" />
      </CardContent>
    </Card>
  );
};

export default LoadingParagraph;

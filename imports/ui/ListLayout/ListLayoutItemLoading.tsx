import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
  circularProgress: {
    height: '8rem',
    weight: '8rem',
  },
}));

export const ListLayoutItemLoading: React.FC<{}> = () => {
  const classes = useStyles();

  return (
    <ListItem className={classes.root} divider>
      <CircularProgress />
    </ListItem>
  );
};

export default ListLayoutItemLoading;

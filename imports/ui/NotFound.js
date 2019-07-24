import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  Grid,
  Paper,
  Typography,
} from '@material-ui/core';

import PageLayout from './utils/PageLayout';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  paper: {
    padding: theme.spacing(4),
    textAlign: 'center',
  }
}));

export default () => {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <PageLayout>
      <Grid item sm />
      <Grid item xs sm={8} md={6} lg={4} xl={3} className={classes.container}>
        <Paper className={classes.paper}>
          <Typography gutterBottom variant='h2'>404 - {('Not found')}</Typography>
          <Typography paragraph>{t('Sorry', '... Hmmm, sorry! :/')}</Typography>
          <Button variant='contained' color='primary' component={Link} to='/'>{t('Head home')}</Button>
        </Paper>
      </Grid>
      <Grid item sm />
    </PageLayout>
  );
};

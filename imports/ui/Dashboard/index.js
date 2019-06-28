import React, { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';

import LogoMenu from '../LogoMenu';
import Panel from '../utils/Panel';

import {
  Grid,
  Typography,
} from '@material-ui/core';
import DashboardIcon from '@material-ui/icons/Dashboard';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    padding: theme.spacing(2),
    width: '100vw',
  },
  pageContent: {
    flexGrow: 1,
    height: '100%',

    '& > *': {
      height: '100%',
      padding: theme.spacing(4, 4, 4, 4),
    }
  },
}));

export const Dashboard = () => {
  const classes = useStyles();
  const [showPanel, setShowPanel] = useState(true);

  const handleClosePanel = () => setShowPanel(false);

  return (
    <div className={classes.root}>
      <LogoMenu />
      <Grid container spacing={4} className={classes.pageContent}>
        <Grid item sm={8} md={4} lg={3}>
          {!showPanel ? null :
            <Panel handleClosePanel={handleClosePanel}>
              <Typography>
                Welcome to your personnal dashboard.
                <DashboardIcon />
              </Typography>
              <Typography>
                Sorry, it is empty. It is yet to build.
              </Typography>
            </Panel>
          }
        </Grid>
      </Grid>
    </div >
  );
}
export default Dashboard;
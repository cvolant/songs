import React, { useState } from 'react';

import Panel from '../utils/Panel';
import PageLayout from '../utils/PageLayout';

import { Grid, Typography } from '@material-ui/core';
import DashboardIcon from '@material-ui/icons/Dashboard';

export const Dashboard = () => {
  const [showPanel, setShowPanel] = useState(true);

  const handleClosePanel = () => setShowPanel(false);

  return (
    <PageLayout>
      {!showPanel ? null :
        <Grid item xs={8} md={4} lg={3}>
          <Panel handleClosePanel={handleClosePanel}>
            <Typography>
              Welcome to your personnal dashboard.
              <DashboardIcon />
            </Typography>
            <Typography>
              Sorry, it is empty. It is yet to build.
            </Typography>
          </Panel>
        </Grid>
      }
    </PageLayout>
  );
}
export default Dashboard;
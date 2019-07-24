import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import Panel from '../utils/Panel';
import PageLayout from '../utils/PageLayout';

import { Grid, Typography } from '@material-ui/core';
import DashboardIcon from '@material-ui/icons/Dashboard';

export const Dashboard = () => {
  const [showPanel, setShowPanel] = useState(true);
  const { t, i18n, ready } = useTranslation();

  console.log('From Dashboard, render. t:', t, 'i18n:', i18n, 'ready:', ready);

  const handleClosePanel = () => setShowPanel(false);

  return (
    <PageLayout>
      {showPanel &&
        <Grid item xs={8} md={4} lg={3}>
          <Panel handleClosePanel={handleClosePanel} closeName={t('dashboard.Close dashboard message', 'Close dashboard message')}>
            <Typography>
              {t('dashboard.Dashboard welcome', 'Welcome')}
              <DashboardIcon />
            </Typography>
            <Typography>
              <Trans i18nKey="dashboard.Dashboard message">
                <span>Sorry,</span> it is <span>empty</span>. It is yet to build.
              </Trans>
            </Typography>
          </Panel>
        </Grid>
      }
    </PageLayout>
  );
}
export default Dashboard;
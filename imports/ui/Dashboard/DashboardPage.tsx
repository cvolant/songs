import React, { useState } from 'react';
import { Switch } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import usePath from '../../hooks/usePath';
import PageLayout from '../Common/PageLayout';
import MainDashboard from './MainDashboard';
import { TutorialContext } from '../Tutorial';

import Route from '../../routes/Route';
import { ITutorialContentName } from '../Tutorial/Tutorial';
import FolderDashboard from './FolderDashboard';

export const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const { path } = usePath('DashboardPage');

  const [
    tutorialContentName,
    setTutorialContentName,
  ] = useState<ITutorialContentName>('Dashboard');

  return (
    <PageLayout
      title={t('dashboard.Dashboard', 'Dashboard')}
      tutorialContentName={tutorialContentName}
    >
      <TutorialContext.Provider value={setTutorialContentName}>
        <Switch>
          <Route component={FolderDashboard} path={path(['dashboard', 'folders', ':folderSlug'])} />
          <Route component={MainDashboard} />
        </Switch>
      </TutorialContext.Provider>
    </PageLayout>
  );
};
export default DashboardPage;

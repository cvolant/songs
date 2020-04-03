import React, { useState } from 'react';
import { Switch } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import usePath from '../../hooks/usePath';
import PageLayout from '../Common/PageLayout';
import MainDashboard from './MainDashboard';
import { TutorialContext } from '../Tutorial';
import { LogoMenuContext } from '../LogoMenu';

import Route from '../../routes/Route';
import { ITutorialContentName } from '../Tutorial/Tutorial';
import FolderDashboard from './FolderDashboard';

export const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const { path } = usePath('DashboardPage');

  const [logoMenuDeployed, setLogoMenuDeployed] = useState(true);
  const [
    tutorialContentName,
    setTutorialContentName,
  ] = useState<ITutorialContentName>('Dashboard');

  const handleToggleLogoMenu = (oc?: boolean) => (): void => {
    setLogoMenuDeployed(typeof oc === 'undefined' ? !logoMenuDeployed : oc);
  };

  return (
    <PageLayout
      menuProps={{ handleToggleLogoMenu, logoMenuDeployed }}
      title={t('dashboard.Dashboard', 'Dashboard')}
      tutorialContentName={tutorialContentName}
    >
      <TutorialContext.Provider value={setTutorialContentName}>
        <LogoMenuContext.Provider value={[logoMenuDeployed, setLogoMenuDeployed]}>
          <Switch>
            <Route component={FolderDashboard} path={path(['dashboard', 'folders', ':folderSlug'])} />
            <Route component={MainDashboard} />
          </Switch>
        </LogoMenuContext.Provider>
      </TutorialContext.Provider>
    </PageLayout>
  );
};
export default DashboardPage;

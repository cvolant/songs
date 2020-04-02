import React, { useState, useEffect, useCallback } from 'react';
import { Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import PageLayout from '../Common/PageLayout';
import MainDashboard from './MainDashboard';
import { TutorialContext } from '../Tutorial';
import { LogoMenuContext } from '../LogoMenu';
import UserCollectionName from './UserCollectionName';

import { IFolder, ISong, IUnfetched } from '../../types';

import { getPath, getRoute } from '../../routes/utils';
import Route from '../../routes/Route';
import { ITutorialContentName } from '../Tutorial/Tutorial';

export const DashboardPage: React.FC = () => {
  const { i18n, t } = useTranslation();

  const history = useHistory();
  const favoriteSongsMatch = useRouteMatch(getPath(i18n.language, 'dashboard', UserCollectionName.FavoriteSongs));
  const createdSongsMatch = useRouteMatch(getPath(i18n.language, 'dashboard', UserCollectionName.CreatedSongs));
  const foldersMatch = useRouteMatch(getPath(i18n.language, 'dashboard', UserCollectionName.Folders));
  const urlCollection = (favoriteSongsMatch && UserCollectionName.FavoriteSongs)
    || (createdSongsMatch && UserCollectionName.CreatedSongs)
    || (foldersMatch && UserCollectionName.Folders)
    || '';

  const setDisplayFromUrl = useCallback((): UserCollectionName | undefined => (
    Object.values(UserCollectionName).find((value) => value === urlCollection)
  ), [urlCollection]);

  const [display, setDisplay] = useState<UserCollectionName>(
    setDisplayFromUrl() || UserCollectionName.FavoriteSongs,
  );
  const [logoMenuDeployed, setLogoMenuDeployed] = useState(true);
  const [
    tutorialContentName,
    setTutorialContentName,
  ] = useState<ITutorialContentName>('Dashboard');

  useEffect(() => {
    const newDisplay = setDisplayFromUrl();
    if (newDisplay) {
      setDisplay(newDisplay);
    }
  }, [setDisplayFromUrl, urlCollection]);

  const handleChangeDisplay = (newDisplay?: UserCollectionName) => (): void => {
    setDisplay(newDisplay || UserCollectionName.FavoriteSongs);
    if (newDisplay) {
      history.push(getPath(i18n.language, 'dashboard', newDisplay));
    }
  };

  const handleToggleLogoMenu = (oc?: boolean) => (): void => {
    setLogoMenuDeployed(typeof oc === 'undefined' ? !logoMenuDeployed : oc);
  };

  const handleSelectFolder = (newFolder: IUnfetched<IFolder>): void => {
    history.push(getPath(i18n.language, 'dashboard', UserCollectionName.Folders, newFolder._id.toHexString()));
  };

  const handleSelectSong = (newSong: IUnfetched<ISong>): void => {
    if (newSong.slug) {
      history.push(getPath(i18n.language, 'song', newSong.slug));
    }
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
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <Route {...getRoute(i18n.language, 'folder')} />
            <Route>
              <MainDashboard
                display={display}
                handleChangeDisplay={handleChangeDisplay}
                logoMenuDeployed={logoMenuDeployed}
                handleSelectFolder={handleSelectFolder}
                handleSelectSong={handleSelectSong}
              />
            </Route>
          </Switch>
        </LogoMenuContext.Provider>
      </TutorialContext.Provider>
    </PageLayout>
  );
};
export default DashboardPage;

import { Meteor } from 'meteor/meteor';
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import PageLayout from '../utils/PageLayout';
import Editor from '../Editor';
import MainDashboard from './MainDashboard';

import UserCollectionName from './UserCollectionName';

import { IFolder, ISong, IUnfetched } from '../../types';

import routesPaths from '../../app/routesPaths';
import FolderDashboard from './FolderDashboard';
import { ITutorialContentName } from '../Tutorial';

interface IDashboardPageProps {
  urlCollection?: string;
}

export const DashboardPage: React.FC<IDashboardPageProps> = ({
  urlCollection,
}) => {
  const { i18n, t } = useTranslation();
  const history = useHistory();

  const setDisplayFromUrl = (): UserCollectionName | undefined => (
    Object.values(UserCollectionName).find((value) => value === urlCollection)
  );

  const [display, setDisplay] = useState<UserCollectionName>(
    setDisplayFromUrl() || UserCollectionName.FavoriteSongs,
  );
  const [folder, setFolder] = useState<IUnfetched<IFolder> | undefined>(undefined);
  const [logoMenuDeployed, setLogoMenuDeployed] = useState(true);
  const [song, setSong] = useState<IUnfetched<ISong> | undefined>(undefined);
  const [
    tutorialContentName,
    setTutorialContentName,
  ] = useState<ITutorialContentName>('Dashboard');

  useEffect(() => {
    const newDisplay = setDisplayFromUrl();
    if (newDisplay) {
      setDisplay(newDisplay);
    }
  }, [urlCollection]);

  const handleChangeDisplay = (newDisplay?: UserCollectionName) => (): void => {
    setDisplay(newDisplay || UserCollectionName.FavoriteSongs);
    if (newDisplay) {
      history.push(routesPaths.path(i18n.language, 'dashboard', newDisplay));
    }
  };

  const handleToggleLogoMenu = (oc?: boolean) => (): void => {
    setLogoMenuDeployed(typeof oc === 'undefined' ? !logoMenuDeployed : oc);
  };

  const goBack = <T, >(setter: React.Dispatch<React.SetStateAction<T | undefined>>) => (): void => {
    setter(undefined);
    setTutorialContentName('Dashboard');
  };

  const handleSelectFolder = (newFolder: IUnfetched<IFolder>): void => {
    setFolder(newFolder);
    setTutorialContentName('Folder');
  };

  const handleSelectSong = (newSong: IUnfetched<ISong>): void => {
    console.log('From DashboardPage, handleSelectSong. newSong.title:', newSong.title);
    setSong(newSong);
    setTutorialContentName('Editor');
  };

  return (
    <PageLayout
      menuProps={{ handleToggleLogoMenu, logoMenuDeployed }}
      title={t('dashboard.Dashboard', 'Dashboard')}
      tutorialContentName={tutorialContentName}
    >
      {((): React.ReactElement => {
        console.log('From DashboardPage, return. song:', song, 'folder:', folder);
        if (folder) {
          return (
            <FolderDashboard
              folder={folder}
              goBack={goBack(setFolder)}
              logoMenuDeployed={logoMenuDeployed}
              handleToggleLogoMenu={handleToggleLogoMenu}
              setTutorialContentName={setTutorialContentName}
            />
          );
        }
        if (song) {
          return (
            <Editor
              edit={song.userId === Meteor.userId() && !song.lyrics}
              goBack={goBack(setSong)}
              logoMenuDeployed={logoMenuDeployed}
              song={song}
            />
          );
        }
        return (
          <MainDashboard
            display={display}
            handleChangeDisplay={handleChangeDisplay}
            logoMenuDeployed={logoMenuDeployed}
            handleSelectFolder={handleSelectFolder}
            handleSelectSong={handleSelectSong}
          />
        );
      })()}
    </PageLayout>
  );
};
export default DashboardPage;

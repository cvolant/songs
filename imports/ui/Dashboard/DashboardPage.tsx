import { Meteor } from 'meteor/meteor';
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';

import Typography from '@material-ui/core/Typography';
import DashboardIcon from '@material-ui/icons/Dashboard';
import Add from '@material-ui/icons/Add';

import PageLayout from '../utils/PageLayout';
import Panel from '../utils/Panel';
import Editor from '../Editor';
import MainDashboard from './MainDashboard';

import FolderEditor from './FolderEditor';
import { CardSearchList } from '../SearchPage/CardSearchList';
import UserCollectionName from './UserCollectionName';

import { IUnfetchedFolder } from '../../types/folderTypes';
import { IUnfetchedSong } from '../../types/songTypes';
import { IIconColor } from '../../types/iconButtonTypes';

import routesPaths from '../../app/routesPaths';

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
  const [folder, setFolder] = useState<IUnfetchedFolder | undefined>(undefined);
  const [logoMenuDeployed, setLogoMenuDeployed] = useState(true);
  const [search, setSearch] = useState<boolean | undefined>(undefined);
  const [song, setSong] = useState<IUnfetchedSong | undefined>(undefined);
  const [showPanel, setShowPanel] = useState(true);

  useEffect(() => {
    const newDisplay = setDisplayFromUrl();
    if (newDisplay) {
      setDisplay(newDisplay);
    }
  }, [urlCollection]);

  const addThisSong = (newSong: IUnfetchedSong) => (): void => {
    if (newSong && newSong._id && folder && folder._id) {
      setSearch(false);
      setSong(undefined);
      Meteor.call('folders.songs.insert', { folderId: folder._id, songId: newSong._id });
    }
  };

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
  };

  const handleAddSong = (): void => {
    setSearch(true);
  };

  const handleClosePanel = (): void => {
    setShowPanel(false);
  };

  const handleFocus = (focus?: boolean) => (): void => {
    setLogoMenuDeployed(!focus);
  };

  const selectFolder = (newFolder: IUnfetchedFolder): void => {
    setFolder(newFolder);
  };

  const handleSelectSong = (newSong: IUnfetchedSong): void => {
    console.log('From DashboardPage, handleSelectSong. newSong.title:', newSong.title);
    setSong(newSong);
  };

  return (
    <PageLayout
      menuProps={{ handleToggleLogoMenu, logoMenuDeployed }}
      sidePanel={showPanel
        ? (
          <Panel
            handleClosePanel={handleClosePanel}
            closeName={t('dashboard.Close dashboard message', 'Close dashboard message')}
          >
            <Typography>
              {t('dashboard.Dashboard welcome', 'Welcome')}
              <DashboardIcon />
            </Typography>
            <Typography>
              <Trans i18nKey="dashboard.Dashboard message">
                <span>Sorry,</span>
                {' '}
                it is
                {' '}
                <span>empty</span>
                . It is yet to build.
              </Trans>
            </Typography>
          </Panel>
        )
        : undefined}

      title={t('dashboard.Dashboard', 'Dashboard')}
      tutorialContentName={(): 'Editor' | 'Folder' | 'Dashboard' => {
        if (song) return 'Editor';
        if (folder) return 'Folder';
        return 'Dashboard';
      }}
    >
      {((): React.ReactElement => {
        console.log('From DashboardPage, return. song:', song, 'folder:', folder);
        if (song) {
          return (
            <Editor
              actionIconButtonProps={folder && search
                ? {
                  ariaLabel: t('folder.Add song', 'Add song'),
                  Icon: Add,
                  onClick: { build: addThisSong },
                  color: 'primary' as IIconColor,
                  disabled: false,
                } : undefined}
              edit={song.userId === Meteor.userId() && !song.pg}
              goBack={goBack(setSong)}
              logoMenuDeployed={logoMenuDeployed}
              song={song}
            />
          );
        }
        if (search) {
          return (
            <CardSearchList
              goBack={goBack(setSearch)}
              handleFocus={handleFocus}
              handleSelectSong={handleSelectSong}
              shortFirstItem={logoMenuDeployed}
              shortSearchField={logoMenuDeployed}
              secondaryActions={[{
                ariaLabel: t('folder.Add song', 'Add song'),
                Icon: Add,
                key: 'addSong',
                onClick: { build: addThisSong },
              }]}
            />
          );
        }
        if (folder) {
          return (
            <FolderEditor
              folder={folder}
              goBack={goBack(setFolder)}
              logoMenuDeployed={logoMenuDeployed}
              handleSelectSong={handleSelectSong}
              handleAddSong={handleAddSong}
            />
          );
        }
        return (
          <MainDashboard
            display={display}
            handleChangeDisplay={handleChangeDisplay}
            logoMenuDeployed={logoMenuDeployed}
            selectFolder={selectFolder}
            handleSelectSong={handleSelectSong}
          />
        );
      })()}
    </PageLayout>
  );
};
export default DashboardPage;

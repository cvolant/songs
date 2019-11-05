import { Meteor } from 'meteor/meteor';
import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import Typography from '@material-ui/core/Typography';
import DashboardIcon from '@material-ui/icons/Dashboard';

import PageLayout from '../utils/PageLayout';
import Panel from '../utils/Panel';
import Editor from '../Editor';
import MainDashboard, { IUserCollectionName } from './MainDashboard';

import { IUnfetchedFolder } from '../../types/folderTypes';
import { IUnfetchedSong } from '../../types/songTypes';
import FolderEditor from './FolderEditor';

export const DashboardPage: React.FC<{}> = () => {
  const { t } = useTranslation();

  const [display, setDisplay] = useState<IUserCollectionName>('favoriteSongs');
  const [folder, setFolder] = useState<IUnfetchedFolder | undefined>(undefined);
  const [logoMenuDeployed, setLogoMenuDeployed] = useState(true);
  const [song, setSong] = useState<IUnfetchedSong | undefined>(undefined);
  const [showPanel, setShowPanel] = useState(true);

  const handleChangeDisplay = (newDisplay?: IUserCollectionName) => (): void => {
    setDisplay(newDisplay || 'favoriteSongs');
  };

  const handleToggleLogoMenu = (oc?: boolean) => (): void => {
    setLogoMenuDeployed(typeof oc === 'undefined' ? !logoMenuDeployed : oc);
  };

  const goBack = (
    setter: React.Dispatch<React.SetStateAction<IUnfetchedFolder | IUnfetchedSong | undefined>>,
  ) => (): void => {
    setter(undefined);
  };

  const handleClosePanel = (): void => setShowPanel(false);

  const selectFolder = (newFolder: IUnfetchedFolder): void => {
    setFolder(newFolder);
  };

  const selectSong = (newSong: IUnfetchedSong): void => {
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
              edit={song.userId === Meteor.userId() && !song.pg}
              goBack={goBack(setSong)}
              logoMenuDeployed={logoMenuDeployed}
              song={song}
            />
          );
        }
        if (folder) {
          return (
            <FolderEditor
              folder={folder}
              goBack={goBack(setFolder)}
              logoMenuDeployed={logoMenuDeployed}
              selectSong={selectSong}
            />
          );
        }
        return (
          <MainDashboard
            display={display}
            handleChangeDisplay={handleChangeDisplay}
            logoMenuDeployed={logoMenuDeployed}
            selectFolder={selectFolder}
            selectSong={selectSong}
          />
        );
      })()}
    </PageLayout>
  );
};
export default DashboardPage;

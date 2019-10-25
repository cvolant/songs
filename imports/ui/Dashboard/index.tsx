import { Meteor } from 'meteor/meteor';
import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { useTheme } from '@material-ui/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Typography from '@material-ui/core/Typography';
import DashboardIcon from '@material-ui/icons/Dashboard';

import PageLayout from '../utils/PageLayout';
import Panel from '../utils/Panel';
import Editor from '../Editor';
import NewSongDialog from './NewSongDialog';
import { ISong } from '../../types';

export const Dashboard: React.FC<{}> = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const smallDevice = useMediaQuery(theme.breakpoints.down('sm'));

  const [logoMenuDeployed, setLogoMenuDeployed] = useState(true);
  const [selectedSong, setSelectedSong] = useState<ISong | undefined>(undefined);
  const [showPanel, setShowPanel] = useState(true);

  const handleToggleLogoMenu = (oc?: boolean) => (): void => {
    setLogoMenuDeployed(typeof oc === 'undefined' ? !logoMenuDeployed : oc);
  };

  const goBack = (): void => {
    setSelectedSong(undefined);
  };

  const handleClosePanel = (): void => setShowPanel(false);

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
      tutorialContentName={selectedSong ? 'Editor' : 'Dashboard'}
      smallDevice={smallDevice}
    >
      {selectedSong
        ? (
          <Editor
            edit={selectedSong.userId === Meteor.userId() && !selectedSong.pg}
            goBack={goBack}
            logoMenuDeployed={logoMenuDeployed}
            song={selectedSong}
          />
        )
        : <NewSongDialog setSelectedSong={setSelectedSong} />}
    </PageLayout>
  );
};
export default Dashboard;

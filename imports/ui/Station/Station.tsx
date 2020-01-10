import { Meteor } from 'meteor/meteor';
import React, { MouseEventHandler, useState } from 'react';
import clsx from 'clsx';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/styles';
import Clear from '@material-ui/icons/Clear';
import BlackScreenOn from '@material-ui/icons/FeaturedVideo';
import BlackScreenOff from '@material-ui/icons/FeaturedVideoOutlined';
import Edit from '@material-ui/icons/Edit';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import NavigateBefore from '@material-ui/icons/NavigateBefore';
import NavigateNext from '@material-ui/icons/NavigateNext';
import PlayArrow from '@material-ui/icons/PlayArrow';
import Replay from '@material-ui/icons/Replay';
import RssFeed from '@material-ui/icons/RssFeed';
import Stop from '@material-ui/icons/Stop';
import Sync from '@material-ui/icons/Sync';

import { useDeviceSize } from '../../hooks/contexts/app-device-size-context';
import FullCardLayout from '../utils/FullCardLayout';
import PrintSong from '../PrintSong';

import { broadcastUpdate } from '../../api/broadcasts/methods';

import { IIconButtonCallback } from '../../types/iconButtonTypes';
import { ISong, IUnfetched } from '../../types';
import { IBroadcast, IBroadcastRights } from '../../types/broadcastTypes';
import { IEditedSong } from '../../types/songTypes';
import PageLayout from '../utils/PageLayout';
import PublishDialog from './PublishDialog';

interface IStationUseStylesProps {
  smallDevice?: boolean;
  blackScreen: boolean;
}
const useStyles = makeStyles((theme) => ({
  card: {
    flexGrow: 1,
  },
  cardContent: {
    opacity: ({ blackScreen }: { blackScreen: boolean }): number => (blackScreen ? 0 : 1),
    transition: theme.transitions.create('opacity'),
    padding: (
      { smallDevice }: IStationUseStylesProps,
    ): number | string => (smallDevice ? theme.spacing(1, 2, 2, 2) : theme.spacing(2, 4, 4, 4)),
  },
  cardHeader: {
    padding: (
      { smallDevice }: IStationUseStylesProps,
    ): number | string => (smallDevice ? theme.spacing(2, 2, 1, 2) : theme.spacing(4, 4, 2, 4)),
    opacity: ({ blackScreen }: IStationUseStylesProps): number => (blackScreen ? 0 : 1),
    transition: theme.transitions.create('opacity'),
  },
  logoMenu: {
    opacity: 0.4,
    transform: 'scale(0.8)',
    transformOrigin: 'top right',
    transition: theme.transitions.create(['opacity', 'transform'], { duration: theme.transitions.duration.short }),

    '&:hover': {
      opacity: 0.8,
      transform: 'scale(1)',
    },
  },
  menus: {
    filter: 'invert(1)',
  },
  root: {
    background: 'white',
    filter: 'saturate(0.2) invert(1)',
    paddingBottom: 0,
  },
}));

interface IStationProps {
  controlId?: string;
  broadcast?: IBroadcast;
  rights?: IBroadcastRights;
  songs?: IEditedSong[];
}

export const Station: React.FC<IStationProps> = ({
  broadcast,
  broadcast: {
    _id,
    addresses: [{
      id: viewerId,
      rights,
    }] = [],
    state,
    state: {
      songNumber: stateSongNb = 0,
      blackScreen = false,
    } = {},
    status,
    title: broadcastTitle,
  } = {},
  songs,
}) => {
  const history = useHistory();
  const { t } = useTranslation();
  const smallDevice = useDeviceSize('sm', 'down');
  const classes = useStyles({ blackScreen, smallDevice });

  const [songNb, setSongNb] = useState();
  const [logoMenuDeployed, setLogoMenuDeployed] = useState(false);
  const [logoMenuTimeout, setLogoMenuTimeout] = useState<NodeJS.Timeout | undefined>();
  const [openPublishDialog, setOpenPublishDialog] = useState(rights === 'owner');

  if (songNb === undefined) {
    setSongNb(stateSongNb);
  }

  const song = songs ? songs[rights === 'readOnly' ? stateSongNb : songNb] : undefined;
  const active = ['control', 'owner'].includes(rights) || status === 'ongoing';

  const handleCloseScreen = (): void => {
    history.push('/');
  };

  const handleToggleLogoMenu = (deploy?: boolean | undefined) => (): void => {
    const newLogoMenuDeployed = typeof deploy === 'boolean' ? deploy : !logoMenuDeployed;
    setLogoMenuDeployed(newLogoMenuDeployed);
    if (newLogoMenuDeployed === false && logoMenuTimeout) {
      clearTimeout(logoMenuTimeout);
      setLogoMenuTimeout(undefined);
    }
  };

  const handleLogoMenuMouseLeave = (): void => {
    if (logoMenuDeployed) {
      if (logoMenuTimeout) {
        clearTimeout(logoMenuTimeout);
      }
      setLogoMenuTimeout(setTimeout(handleToggleLogoMenu(false), 4000));
    }
  };

  const handleEditSong = (songNumber: number) => (): void => {
    console.log('From Station, handleEditSong. songNumber:', songNumber);


  };

  const handlePreviousNext = (forward: number) => (): void => {
    const newSongNb = songNb + forward;
    if (songs && newSongNb >= 0 && newSongNb < songs.length) {
      setSongNb(newSongNb);
    }
  };

  const handleUpdateBroadcast = (
    updates: {
      state?: IBroadcast['state'];
      status?: IBroadcast['status'];
    },
    callback?: IIconButtonCallback,
  ) => (): void => {
    console.log('From Station, handleUpdateBroadcast. updates:', updates);
    if (_id) {
      if (['control', 'owner'].includes(rights)) {
        broadcastUpdate.call({
          _id,
          updates,
          viewerId,
        }, (err, res) => {
          if (err) {
            console.error('From Station.handleUpdateBroadcast. err:', err);
          }
          if (callback) {
            callback(err, res);
          }
        });
      } else if (callback) {
        callback(new Meteor.Error('Control rights needed to perform this action'));
        console.error('From Station, handleControlPreviousNext.', 'Control rights needed to perform this action');
      }
    } else if (callback) {
      callback(new Meteor.Error('No broadcast loaded'));
      console.error('From Station, handleControlPreviousNext.', 'No broadcast loaded');
    }
  };

  const handleControlPreviousNext = (
    forward: number,
    callback?: IIconButtonCallback,
  ): (
    ) => void => {
    const newStateSongNb = stateSongNb + forward;
    if (songs && newStateSongNb >= 0 && newStateSongNb < songs.length) {
      return handleUpdateBroadcast({
        state: { songNumber: newStateSongNb },
      }, (err, res) => {
        if (!err) {
          handlePreviousNext(forward)();
          if (callback) {
            callback(err, res);
          }
        }
      });
    }
    return (): void => {};
  };

  const handlePublish = (callback?: IIconButtonCallback) => (): void => {
    if (status === 'unpublished' || typeof status === 'undefined') {
      handleUpdateBroadcast({ status: 'unstarted' }, callback);
    } else if (callback) {
      callback(null);
    }
    setOpenPublishDialog(true);
  };

  const handleClosePublishDialog = (): void => {
    console.log('From Station, handleClosePublishDialog. viewerId:', viewerId, 'broadcast:', broadcast);
    setOpenPublishDialog(false);
  };

  console.log('From Station, render. status', status, 'handleUpdateBroadcast', handleUpdateBroadcast, 'broadcast:', broadcast);

  return (
    <PageLayout
      className={classes.root}
      disableLogoMenu={['readOnly', 'navigate'].includes(rights)}
      menuProps={{
        classes: {
          logoMenu: clsx(classes.logoMenu, classes.menus),
          topMenu: classes.menus,
        },
        handleToggleLogoMenu,
        logoMenuDeployed,
        onMouseLeave: handleLogoMenuMouseLeave,
      }}
      title={
        [
          'Alleluia.plus',
          broadcastTitle,
          active && songs && songs[songNb] && songs[songNb].title,
        ].filter((e) => e).join(' - ')
      }
      tutorialContentName="Station"
    >
      <FullCardLayout
        actions={rights === 'readOnly' || (rights === 'navigate' && status !== 'ongoing') ? undefined : [
          [
            //
            // Publish button
            //
            rights === 'owner' && {
              color: status !== 'unpublished' ? 'primary' : 'default',
              Icon: RssFeed,
              key: 'publish',
              label: t('station.Publish', 'Publish'),
              labelVisible: !smallDevice,
              onClick: {
                build: ({ callback }: {
                  element?: IUnfetched<ISong>;
                  callback?: IIconButtonCallback;
                }): () => void => handlePublish(callback),
                callback: true,
              },
            },
            //
            // State button: Publish/Start/End/Reset
            //
            rights === 'owner' && status && status !== 'unpublished' && {
              color: {
                // unpublished: 'default',
                unstarted: 'default',
                ongoing: 'primary',
                ended: 'default',
              }[status],
              Icon: {
                // unpublished: RssFeed,
                unstarted: PlayArrow,
                ongoing: Stop,
                ended: Replay,
              }[status],
              key: 'status',
              label: {
                // unpublished: t('station.Publish', 'Publish'),
                unstarted: t('station.Start', 'Start'),
                ongoing: t('station.End', 'End'),
                ended: t('station.Reset', 'Reset'),
              }[status],
              labelVisible: !smallDevice,
              onClick: {
                build: ({ callback }: {
                  element?: IUnfetched<ISong>;
                  callback?: IIconButtonCallback;
                }): () => void => handleUpdateBroadcast({
                  status: {
                    // unpublished: 'unstarted',
                    unstarted: 'ongoing',
                    ongoing: 'ended',
                    ended: 'unstarted',
                  }[status] as IBroadcast['status'],
                }, callback),
                callback: true,
              },
            },
            //
            // BlackScreen button
            //
            ['control', 'owner'].includes(rights) && {
              Icon: blackScreen ? BlackScreenOn : BlackScreenOff,
              key: 'black-screen',
              label: blackScreen
                ? t('station.Unblack screen', 'Unblack screen')
                : t('station.Black screen', 'Black screen'),
              labelVisible: !smallDevice,
              onClick: {
                build: ({ callback }: {
                  element?: IUnfetched<ISong>;
                  callback?: IIconButtonCallback;
                }): () => void => handleUpdateBroadcast({
                  state: {
                    ...state,
                    blackScreen: !blackScreen,
                  },
                }, callback),
                callback: true,
              },
            },
            //
            // Edit button
            //
            ['control', 'owner'].includes(rights) && {
              disabled: true,
              Icon: Edit,
              key: 'edit',
              label: t('station.Edit', 'Edit this song'),
              labelVisible: !smallDevice,
              onClick: handleEditSong(songNb),
            },
          ],
          //
          // Navigation buttons: First, Previous, (Display), Current, Next, Last
          //
          songs && [
            // First
            {
              disabled: songNb === 0,
              Icon: FirstPage,
              key: 'nav-first',
              label: t('station.First', 'First'),
              onClick: handlePreviousNext(songNb),
            },
            // Previous
            {
              disabled: songNb === 0,
              Icon: NavigateBefore,
              key: 'nav-previous',
              label: t('station.Previous', 'Previous'),
              onClick: handlePreviousNext(-1),
            },
            // (Display)
            {
              disabled: true,
              key: 'nav-display',
              label: `${songNb + 1}/${songs.length}`,
              labelVisible: true,
              onClick: (): void => { },
            },
            // Current
            {
              disabled: songNb === stateSongNb,
              Icon: Sync,
              key: 'nav-current',
              label: t('station.Current', 'Current'),
              onClick: handlePreviousNext(stateSongNb - songNb),
            },
            // Next
            {
              disabled: songNb === songs.length - 1,
              Icon: NavigateNext,
              key: 'nav-next',
              label: t('station.Next', 'Next'),
              onClick: handlePreviousNext(1),
            },
            // Last
            {
              disabled: songNb === songs.length - 1,
              Icon: LastPage,
              key: 'nav-last',
              label: t('station.Last', 'Last'),
              onClick: handlePreviousNext(1),
            },
          ],
        ]}
        className={classes.card}
        contentProps={{ className: classes.cardContent }}
        fabs={['readOnly', 'navigate'].includes(rights) || !songs ? undefined : [
          // Control: Previous
          {
            disabled: stateSongNb === 0,
            Icon: NavigateBefore,
            key: 'control-previous',
            label: t('station.Previous', 'Previous') as string,
            onClick: {
              build: ({ callback }: {
                element?: IUnfetched<ISong>;
                callback?: IIconButtonCallback;
              }): () => void => handleControlPreviousNext(-1, callback),
              callback: true,
            },
          },
          // Control: (Display)
          {
            disabled: true,
            key: 'control-display',
            label: `${stateSongNb + 1}/${songs.length}`,
            labelVisible: true,
            onClick: ((): void => { }) as MouseEventHandler,
          },
          // Control: Next
          {
            disabled: stateSongNb === songs.length - 1,
            Icon: NavigateNext,
            key: 'control-next',
            label: t('station.Next', 'Next') as string,
            onClick: {
              build: ({ callback }: {
                element?: IUnfetched<ISong>;
                callback?: IIconButtonCallback;
              }): () => void => handleControlPreviousNext(1, callback),
              callback: true,
            },
          },
        ]}
        cardProps={{ elevation: 0 }}
        headerAction={['readOnly', 'navigate'].includes(rights) && {
          Icon: Clear,
          key: 'close',
          label: t('station.Close', 'Close') as string,
          onClick: handleCloseScreen,
        }}
        headerProps={{ className: classes.cardHeader }}
        headerSubheader={active ? (song && song.subtitle) || '' : t('station.Broadcast not started', 'This broadcast has not started yet')}
        headerTitle={active ? (song && song.title) : broadcastTitle}
        shortHeader={0}
      >
        {active && song && <PrintSong song={song} zoom={0.5} />}
      </FullCardLayout>
      <PublishDialog
        broadcastOwnerId={viewerId}
        handleClose={handleClosePublishDialog}
        open={openPublishDialog}
      />
    </PageLayout>
  );
};

export default Station;

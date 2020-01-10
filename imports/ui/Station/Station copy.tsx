import { Meteor } from 'meteor/meteor';
import React, { MouseEventHandler, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useHistory } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/styles';
import Clear from '@material-ui/icons/Clear';
import BlackScreenOn from '@material-ui/icons/FeaturedVideo';
import BlackScreenOff from '@material-ui/icons/FeaturedVideoOutlined';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import NavigateBefore from '@material-ui/icons/NavigateBefore';
import NavigateNext from '@material-ui/icons/NavigateNext';
import PowerSettingsNew from '@material-ui/icons/PowerSettingsNew';
import Replay from '@material-ui/icons/Replay';
import RssFeed from '@material-ui/icons/RssFeed';
import Sync from '@material-ui/icons/Sync';

import { useDeviceSize } from '../../hooks/contexts/app-device-size-context';
import FullCardLayout from '../utils/FullCardLayout';
import Loading from '../Loading';
import LogoMenu from '../LogoMenu';
import NotFound from '../NotFound';
import PrintSong from '../PrintSong';

import Broadcasts from '../../api/broadcasts/broadcasts';
import { broadcastUpdate } from '../../api/broadcasts/methods';
import Songs from '../../api/songs/songs';

import { IIconButtonCallback } from '../../types/iconButtonTypes';
import { ISong, IUnfetched } from '../../types';
import { IBroadcastRights, IBroadcastStatus, IBroadcastState } from '../../types/broadcastTypes';

interface IStationUseStylesProps {
  smallDevice: boolean;
  blackScreen: boolean;
}
const useStyles = makeStyles((theme) => ({
  card: {
    flexGrow: 1,
  },
  cardContent: {
    opacity: ({ blackScreen }: { blackScreen: boolean }): number => {
      console.log('From Station, useStyles, cardContent. blackScreen:', blackScreen);
      return (blackScreen ? 0 : 1);
    },
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
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    width: '100vw',
  },
}));

interface IStationProps {
  broadcastId: string;
}

export const Station: React.FC<IStationProps> = ({ broadcastId }) => {
  const history = useHistory();
  const { t } = useTranslation();
  const smallDevice = useDeviceSize('sm', 'down') || true;

  const [songNb, setSongNb] = useState();
  const [logoMenuDeployed, setLogoMenuDeployed] = useState(false);
  const [logoMenuTimeout, setLogoMenuTimeout] = useState<NodeJS.Timeout | undefined>();

  const broadcastLoading = useTracker(() => {
    // Note that this subscription will get cleaned up
    // when your component is unmounted or deps change.
    const handle = Meteor.subscribe('broadcast', broadcastId);
    return !handle.ready();
  }, [broadcastId]);

  const uTb = useTracker(() => {
    const tBroadcast = Broadcasts.findOne({ 'addresses.id': broadcastId });
    return {
      broadcast: tBroadcast,
      status: tBroadcast ? tBroadcast.status : 'unstarted',
      state: tBroadcast ? tBroadcast.state : undefined,
      broadcastTitle: (tBroadcast && tBroadcast.title) || '',
      ...tBroadcast ? tBroadcast.state : {},
    };
  }, []);
  const {
    broadcast,
    status,
    state,
    broadcastTitle,
    songNumber: stateSongNb,
    blackScreen = false,
  } = uTb;

  const songs = useTracker(() => Songs.find({}).fetch(), []);

  const classes = useStyles({ blackScreen, smallDevice });

  if (broadcast && songNb === undefined) {
    setSongNb(broadcast.state.songNumber || 0);
  }

  let rights: IBroadcastRights = 'readOnly';
  let controlId = '';
  if (broadcast && broadcast.addresses) {
    const { addresses } = broadcast;
    controlId = (addresses.find((address) => address.rights === 'control') || {}).id || '';
    if (addresses.find((address) => address.rights === 'control')) {
      rights = 'control';
    } else if (addresses.find((address) => address.rights === 'navigate')) {
      rights = 'navigate';
    }
  }

  const song = songs[rights === 'readOnly' ? stateSongNb : songNb];
  const active = rights === 'control' || status === 'ongoing';

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
    console.log('From Station, handleLogoMenuBlur. logoMenuTimeout:', logoMenuTimeout);
    if (logoMenuDeployed) {
      if (logoMenuTimeout) {
        clearTimeout(logoMenuTimeout);
      }
      setLogoMenuTimeout(setTimeout(handleToggleLogoMenu(false), 4000));
    }
  };

  const handlePreviousNext = (forward: number) => (): void => {
    const newSongNb = songNb + forward;
    if (newSongNb >= 0 && newSongNb < songs.length) {
      setSongNb(newSongNb);
    }
  };

  const handleUpdateBroadcast = (
    updates: {
      state?: IBroadcastState;
      status?: IBroadcastStatus;
    },
    callback?: IIconButtonCallback,
  ) => (): void => {
    if (broadcast) {
      if (controlId) {
        broadcastUpdate.call({
          _id: broadcast._id,
          updates,
          controlId,
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
    if (typeof stateSongNb === 'number') {
      const newStateSongNb = stateSongNb + forward;
      if (newStateSongNb >= 0 && newStateSongNb < songs.length) {
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
    }
    return (): void => {};
  };

  if (!broadcastLoading && broadcast && songs && songs[songNb]) {
    return (
      <div className={classes.root}>
        <Helmet>
          <title>
            {
              [
                'Alleluia.plus',
                broadcastTitle,
                active && songs[songNb].title,
              ].filter((e) => e).join(' - ')
            }
          </title>
        </Helmet>
        {rights === 'control' && (
          <div onMouseLeave={handleLogoMenuMouseLeave} className={classes.menus}>
            <LogoMenu
              classes={{ logoMenu: classes.logoMenu }}
              handleToggleLogoMenu={handleToggleLogoMenu}
              logoMenuDeployed={logoMenuDeployed}
              tutorialAvailable
            />
          </div>
        )}
        <FullCardLayout
          actions={rights === 'readOnly' || (!active && rights === 'navigate') ? undefined : [
            rights === 'control' && {
              color: {
                unpublished: 'default',
                unstarted: 'default',
                ongoing: 'primary',
                ended: 'default',
              }[status],
              Icon: {
                unpublished: RssFeed,
                unstarted: PowerSettingsNew,
                ongoing: PowerSettingsNew,
                ended: Replay,
              }[status],
              key: 'status',
              label: {
                unpublished: t('station.Publish', 'Publish'),
                unstarted: t('station.Start', 'Start'),
                ongoing: t('station.End', 'End'),
                ended: t('station.Reset', 'Reset'),
              }[status],
              labelVisible: true,
              onClick: {
                build: ({ callback }: {
                  element?: IUnfetched<ISong>;
                  callback?: IIconButtonCallback;
                }): () => void => handleUpdateBroadcast({
                  status: {
                    unpublished: 'unstarted',
                    unstarted: 'ongoing',
                    ongoing: 'ended',
                    ended: 'unstarted',
                  }[status] as IBroadcastStatus,
                }, callback),
                callback: true,
              },
            },
            rights === 'control' && {
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
            [
              {
                disabled: songNb === 0,
                Icon: FirstPage,
                key: 'nav-first',
                label: t('station.First', 'First'),
                onClick: handlePreviousNext(songNb),
              },
              {
                disabled: songNb === 0,
                Icon: NavigateBefore,
                key: 'nav-previous',
                label: t('station.Previous', 'Previous'),
                onClick: handlePreviousNext(-1),
              },
              {
                disabled: true,
                key: 'nav-display',
                label: `${songNb + 1}/${songs.length}`,
                labelVisible: true,
                onClick: (): void => { },
              },
              {
                disabled: songNb === stateSongNb,
                Icon: Sync,
                key: 'nav-current',
                label: t('station.Current', 'Current'),
                onClick: handlePreviousNext(typeof stateSongNb === 'number' ? stateSongNb - songNb : 0),
              },
              {
                disabled: songNb === songs.length - 1,
                Icon: NavigateNext,
                key: 'nav-next',
                label: t('station.Next', 'Next'),
                onClick: handlePreviousNext(1),
              },
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
          fabs={rights !== 'control' ? undefined : [
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
            {
              disabled: true,
              key: 'control-display',
              label: `${typeof stateSongNb === 'number' ? stateSongNb + 1 : '?'}/${songs.length}`,
              labelVisible: true,
              onClick: ((): void => { }) as MouseEventHandler,
            },
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
          headerAction={rights !== 'control' && {
            Icon: Clear,
            label: t('station.Close', 'Close') as string,
            onClick: handleCloseScreen,
          }}
          headerProps={{ className: classes.cardHeader }}
          headerSubheader={active ? song.subtitle : t('station.This broadcast has not started yet', 'This broadcast has not started yet')}
          headerTitle={active ? song.title : broadcastTitle}
          shortHeader={0}
        >
          {active && <PrintSong song={song} zoom={0.5} />}
        </FullCardLayout>
      </div>
    );
  }
  if (broadcastLoading) {
    return <Loading />;
  }
  return <NotFound />;
};

export default Station;

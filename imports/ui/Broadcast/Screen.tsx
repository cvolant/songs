import React, { ReactChildren, ReactChild } from 'react';

import { makeStyles } from '@material-ui/styles';

import { useDeviceSize } from '../../hooks/contexts/DeviceSize';
import FullCardLayout, { IFullCardLayoutProps } from '../Common/FullCardLayout';
import PrintSong from './PrintSong';

import { ISong } from '../../types';
import { IEditedSong } from '../../types/songTypes';
import PageLayout from '../Common/PageLayout';

interface IStationUseStylesProps {
  smallDevice?: boolean;
  blackScreen: boolean;
}
const useStyles = makeStyles((theme) => ({
  card: {
    flexGrow: 1,
  },
  cardContent: {
    opacity: ({ blackScreen }: IStationUseStylesProps): number => (blackScreen ? 0 : 1),
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
    transition: theme.transitions.create('filter'),
    paddingBottom: 0,
  },
  root: {
    background: theme.palette.background.paper,
    filter: 'saturate(0.2) invert(1)',
    transition: theme.transitions.create('filter'),
    paddingBottom: 0,
  },
}));

interface IStationProps {
  actions?: IFullCardLayoutProps<ISong>['actions'];
  blackScreen?: boolean;
  children?: ReactChildren | ReactChild;
  fabs?: IFullCardLayoutProps<ISong>['fabs'];
  handleReturn?: () => void;
  headerAction?: IFullCardLayoutProps<ISong>['headerAction'];
  headerSubheader?: IFullCardLayoutProps<ISong>['headerSubheader'];
  headerTitle?: IFullCardLayoutProps<ISong>['headerTitle'];
  song?: IEditedSong;
  title: string;
}

export const Station: React.FC<IStationProps> = ({
  actions,
  blackScreen = false,
  children,
  fabs,
  handleReturn,
  headerAction,
  headerSubheader,
  headerTitle,
  song,
  title,
}) => {
  const smallDevice = useDeviceSize('sm', 'down');
  const classes = useStyles({ blackScreen, smallDevice });

  return (
    <PageLayout
      className={classes.root}
      title={title}
      tutorialContentName="Station"
    >
      <FullCardLayout
        actions={actions}
        className={classes.card}
        contentProps={{ className: classes.cardContent }}
        fabs={fabs}
        cardProps={{ elevation: 0 }}
        handleReturn={handleReturn}
        headerAction={headerAction}
        headerProps={{ className: classes.cardHeader }}
        headerSubheader={headerSubheader}
        headerTitle={headerTitle}
        shortHeader={0}
      >
        {song && <PrintSong song={song} zoom={0.5} />}
        {children}
      </FullCardLayout>
    </PageLayout>
  );
};

export default Station;

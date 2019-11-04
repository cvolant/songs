import React from 'react';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import QueueMusic from '@material-ui/icons/QueueMusic';
import Check from '@material-ui/icons/Check';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';

import { useDeviceSize } from '../../state-contexts/app-device-size-context';
import SongListItemText from './SongListItemText';

import { ISong } from '../../types';

const useStyles = makeStyles((theme) => ({
  listIcon: {
    justifyContent: 'center',
  },
  root: {
    paddingLeft: 0,
    paddingRight: (
      { displayFavorite }: { displayFavorite: boolean | undefined },
    ): number => theme.spacing(displayFavorite ? 11 : 5),
  },
  secondaryAction: {
    right: 0,
  },
}));

interface ISongListItemProps {
  favorite?: boolean;
  handleSelect: () => void;
  handleToggleFavorite: (value?: boolean) => () => void;
  handleUnfold: () => void;
  displayFavorite: boolean;
  song: ISong;
  unfolded: boolean;
}

export const SongListItem: React.FC<ISongListItemProps> = ({
  favorite,
  handleSelect,
  handleToggleFavorite,
  handleUnfold,
  displayFavorite,
  song,
  unfolded,
}) => {
  const { t } = useTranslation();
  const classes = useStyles({ displayFavorite });
  const smallDevice = useDeviceSize('sm.down');

  return (
    <ListItem
      button={!unfolded}
      className={classes.root}
      divider
      onClick={handleUnfold}
    >
      {!smallDevice && (
        <ListItemIcon className={classes.listIcon}>
          <QueueMusic />
        </ListItemIcon>
      )}
      <SongListItemText
        song={song}
        unfolded={unfolded}
      />
      <ListItemSecondaryAction className={classes.secondaryAction}>
        {displayFavorite
          && (
            <IconButton
              aria-label={favorite ? t('search.Unmark as favorite', 'Unmark as favorite') : t('search.Mark as favorite', 'Mark as favorite')}
              onClick={handleToggleFavorite()}
            >
              {favorite ? <Favorite color="primary" /> : <FavoriteBorder />}
            </IconButton>
          )}
        <IconButton aria-label={t('search.Choose this song', 'Choose this song')} onClick={handleSelect}>
          <Check />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default SongListItem;

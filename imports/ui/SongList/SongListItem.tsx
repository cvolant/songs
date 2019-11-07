import React, { MouseEventHandler, useState, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Eye from '@material-ui/icons/RemoveRedEye';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import QueueMusic from '@material-ui/icons/QueueMusic';

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
      { nbRightIcons }: { nbRightIcons: number },
    ): number => theme.spacing([1, 5, 12][nbRightIcons]),
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
  rightIconButton?: ReactElement;
  song: ISong;
  unfolded: boolean;
}

export const SongListItem: React.FC<ISongListItemProps> = ({
  favorite,
  handleSelect,
  handleToggleFavorite,
  handleUnfold,
  displayFavorite,
  rightIconButton,
  song,
  unfolded,
}) => {
  const { t } = useTranslation();
  const classes = useStyles({
    nbRightIcons: (displayFavorite ? 1 : 0) + (rightIconButton ? 1 : 0),
  });
  const smallDevice = useDeviceSize('sm.down');
  const [hover, setHover] = useState(false);

  const handleMouseEnter: MouseEventHandler<HTMLDivElement> = () => {
    setHover(true);
  };

  const handleMouseLeave: MouseEventHandler<HTMLDivElement> = () => {
    setHover(false);
  };

  return (
    <ListItem
      button={!unfolded}
      className={classes.root}
      divider
      onClick={handleUnfold}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {!smallDevice && (
        <ListItemIcon className={classes.listIcon}>
          {
            hover || unfolded
              ? (
                <IconButton
                  aria-label={t('search.Details', 'Details')}
                  onClick={handleSelect}
                >
                  <Eye />
                </IconButton>
              ) : <QueueMusic />
          }
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
        {rightIconButton}
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default SongListItem;

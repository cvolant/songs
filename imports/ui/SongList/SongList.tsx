import React, { useRef, useState, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';

import { Mongo } from 'meteor/mongo';
import SongListItem from './SongListItem';
import SongListItemLoading from './SongListItemLoading';
import SongListSorting from './SongListSorting';
import {
  ISong,
  ISortSpecifier,
  ISearch,
  ISortCriterion,
} from '../../types';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: 'inherit',
    display: 'flex',
    flexDirection: 'column',
    overflowScrolling: 'touch',
    overflowY: 'auto',
    width: '100%',
  },
  emptyItemContainer: {
    padding: theme.spacing(2),
  },
}));

interface ISongListProps {
  displayFavorite: boolean;
  displaySort: boolean;
  emptyListPlaceholder?: ReactNode;
  favoriteSongs: Mongo.ObjectID[];
  handleSelectSong?: (song: ISong) => void;
  handleSort: (sortCriterion: ISortCriterion) => () => void;
  handleToggleDisplaySort: (open?: boolean) => () => void;
  handleToggleFavoriteSong: (songId: Mongo.ObjectID, value?: boolean) => () => void;
  loading?: boolean;
  logoMenuDeployed?: boolean;
  raiseLimit: () => void;
  search?: ISearch;
  songs: ISong[];
  sort?: ISortSpecifier;
}

export const SongList: React.FC<ISongListProps> = ({
  displayFavorite,
  displaySort,
  emptyListPlaceholder,
  favoriteSongs,
  handleSelectSong = (): void => { },
  handleSort,
  handleToggleDisplaySort,
  handleToggleFavoriteSong,
  loading = false,
  raiseLimit,
  songs,
  sort,
}) => {
  const listRef = useRef<HTMLElement>();
  const { t } = useTranslation();
  const classes = useStyles();

  const [unfoldedSong, setUnfoldedSong] = useState();

  const handleListScroll = (): void => {
    if (!loading && listRef.current) {
      const {
        current: {
          scrollTop,
          scrollHeight,
          clientHeight,
        },
      } = listRef;
      const scrollPosition = (scrollTop * 100) / (scrollHeight - clientHeight);
      if (scrollPosition > 90) {
        console.log('From SongList, handleListScroll. scrollPosition:', scrollPosition);
        raiseLimit();
      }
    }
  };

  const handleSelect = (song: ISong) => (): void => handleSelectSong(song);
  const handleUnfold = (songId: Mongo.ObjectID) => (): void => setUnfoldedSong(songId);

  return (
    <List
      component="nav"
      className={classes.root}
      onScroll={handleListScroll}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={listRef as any}
      subheader={displaySort && (songs.length > 0 || loading)
        ? (
          <SongListSorting
            displayFavorite={displayFavorite}
            handleToggleDisplaySort={handleToggleDisplaySort}
            handleSort={handleSort}
            sort={sort}
          />
        )
        : undefined}
    >
      {songs.length === 0 && !loading
        ? (
          <div className={classes.emptyItemContainer}>
            {emptyListPlaceholder || (
              <Typography>
                {t('search.Nothing found so far', 'Nothing found so far.')}
              </Typography>
            )}
          </div>
        )
        : songs.map((song) => {
          const songId = song._id;
          const favorite = favoriteSongs
            ? favoriteSongs
              .map((favoriteSong) => favoriteSong.toHexString())
              .indexOf(songId.toHexString()) !== -1 : false;
          return (
            <SongListItem
              displayFavorite={displayFavorite}
              favorite={favorite}
              handleSelect={handleSelect(song)}
              handleToggleFavorite={
                (value): (() => void) => handleToggleFavoriteSong(songId, value)
              }
              handleUnfold={handleUnfold(songId)}
              key={song._id.toHexString()}
              song={song}
              unfolded={unfoldedSong === songId}
            />
          );
        })}
      {loading && <SongListItemLoading />}
    </List>
  );
};

export default SongList;

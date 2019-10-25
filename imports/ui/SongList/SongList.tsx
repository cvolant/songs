import React, { createRef, useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';

import { Mongo } from 'meteor/mongo';
import SongListItem from './SongListItem';
import SongListItemLoading from './SongListItemLoading';
import SongListEmptyItem from './SongListEmptyItem';
import SongListSorting from './SongListSorting';
import {
  ISong,
  ISortSpecifier,
} from '../../types';

const useStyles = makeStyles(() => ({
  root: {
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    overflowScrolling: 'touch',
    width: '100%',
  },
}));

interface ISongListProps {
  displaySort: boolean;
  favoriteSongs: Mongo.ObjectID[];
  handleFocus: (focus?: boolean) => () => void;
  handleSelectSong: (song: ISong) => void;
  handleSort: (sortCriterion: string) => () => void;
  handleToggleDisplaySort: (open?: boolean) => () => void;
  handleToggleFavorite: (songId: Mongo.ObjectID, value?: boolean) => () => void;
  isAuthenticated: boolean;
  loading?: boolean;
  logoMenuDeployed?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  raiseLimit: () => void;
  search?: { [key: string]: string };
  smallDevice: boolean;
  songs: ISong[];
  sort?: ISortSpecifier;
}

export const SongList: React.FC<ISongListProps> = ({
  displaySort,
  favoriteSongs,
  handleSelectSong,
  handleSort,
  handleToggleDisplaySort,
  handleToggleFavorite,
  isAuthenticated,
  loading = false,
  raiseLimit,
  search,
  smallDevice,
  songs,
  sort,
}) => {
  const listRef = createRef<HTMLElement>();

  const classes = useStyles();

  const [unfoldedSong, setUnfoldedSong] = useState();

  const handleListScroll = (): void => {
    if (!limitRaised && listRef.current) {
      const {
        current: {
          scrollTop,
          scrollHeight,
          clientHeight,
        },
      } = listRef;
      const scrollPosition = (scrollTop * 100) / (scrollHeight - clientHeight);
      if (scrollPosition > 90) {
        console.log('From SearchList, useLayoutEffet. scrollPosition:', scrollPosition);
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
      ref={listRef}
      subheader={displaySort && (songs.length > 0 || loading)
        ? (
          <SongListSorting
            displayFavorite={isAuthenticated}
            handleToggleDisplaySort={handleToggleDisplaySort}
            handleSort={handleSort}
            sort={sort}
            smallDevice={smallDevice}
          />
        )
        : undefined}
    >
      {songs.length === 0 && !loading
        ? <SongListEmptyItem search={search} />
        : songs.map((song) => {
          const songId = song._id;
          const favorite = favoriteSongs
            ? favoriteSongs
              .map((favoriteSong) => favoriteSong.toHexString())
              .indexOf(songId.toHexString()) !== -1 : false;
          return (
            <SongListItem
              displayFavorite={isAuthenticated}
              favorite={favorite}
              handleSelect={handleSelect(song)}
              handleToggleFavorite={(value): (() => void) => handleToggleFavorite(songId, value)}
              handleUnfold={handleUnfold(songId)}
              key={song._id.toHexString()}
              smallDevice={smallDevice}
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

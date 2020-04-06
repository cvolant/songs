import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { useTracker } from 'meteor/react-meteor-data';
import React, { useState, useEffect, useCallback } from 'react';

import { makeStyles } from '@material-ui/core';

import SearchField from './SearchField';
import SongList from '../Songs/SongList';
import SearchListNoResult from './SearchListNoResult';

import { ISong, IUser, IUnfetched } from '../../types';
import {
  ISearch,
  ISortSpecifier,
  ISortSpecifierValue,
  ISortCriterion,
} from '../../types/searchTypes';
import { IArrayIconButtonProps } from '../../types/iconButtonTypes';

import Songs from '../../api/songs/songs';
import { userFavoriteToggle } from '../../api/users/methods';

import buildQuery from './buildQuery';

const nbItemsPerPage = 20;

const useStyles = makeStyles(() => ({
  hidden: {
    display: 'none',
  },
  root: {
    backgroundColor: 'inherit',
    display: 'flex',
    flexDirection: 'column',
    margin: '0 auto',
    overflow: 'hidden',
    width: '100%',
  },
}));

interface ISearchListProps {
  handleSelectSong: (song: ISong) => void;
  hidden?: boolean;
  secondaryActions?: IArrayIconButtonProps<IUnfetched<ISong>>[];
}

export const SearchList: React.FC<ISearchListProps> = ({
  handleSelectSong,
  hidden = false,
  secondaryActions,
}) => {
  const classes = useStyles();

  const [displaySort, setDisplaySort] = useState(false);
  const [limit, setLimit] = useState(nbItemsPerPage);
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState<ISortSpecifier<ISong> | undefined>(undefined);
  const [search, setSearch] = useState<ISearch | undefined>();
  const [songs, setSongs] = useState<ISong[]>([]);
  const [favoriteSongs, setFavoriteSongs] = useState<Mongo.ObjectID[]>([]);

  useEffect(() => {
    if (search
      && (search.globalQuery
        || (search.specificQueries && Object.keys(search.specificQueries).length)
      )
    ) {
      const builtQuery = buildQuery({
        search,
        options: {
          limit,
          sort,
          transform: (doc): object => ({
            ...doc,
            fromSearch: true,
          }),
        },
      });

      const subscription = Meteor.subscribe('songs', builtQuery, () => {
        /* console.log(
          'From SearchList, useEffect[search, sort], subscription callback.',
          'setLoading(false) + setLimitRaised(false)',
        ); */
        setLoading(false);
      });

      /* console.log(
        'From SearchList, useEffect[search, sort]: subscription with',
        '{ query, options }:', JSON.stringify(builtQuery),
        '\nsubscription:', subscription,
      ); */

      return subscription.stop;
    }
    // console.log('From Songlist, useEffect[search, sort]. Empty search: stopLoading().');
    setLoading(false);
    return (): void => { /* Empty function */ };
  }, [search, sort, limit]);

  const uTResult = useTracker(() => {
    const user = Meteor.user() as IUser;
    let uTFavoriteSongs: Mongo.ObjectID[] = [];
    let uTSongs: ISong[] = [];

    if (!loading) {
      uTFavoriteSongs = user ? user.favoriteSongs : [];
      uTSongs = Songs.find({}).fetch();

      setSongs(uTSongs);
      setFavoriteSongs(uTFavoriteSongs);
    }

    return {
      isAuthenticated: !!user,
      uTSongs, // Unused.
      uTFavoriteSongs, // Unused.
    };
  }, [loading]);

  const { isAuthenticated } = uTResult;

  /* console.log(
    'From SearchList, render.',
    'loading:', loading,
    'songs[0]:', songs[0],
  ); */

  useEffect(() => {
    setLimit(nbItemsPerPage);
  }, [search]);

  const raiseLimit = (): void => {
    if (songs.length === limit) {
      /* console.log(
        'From SearchList, raiseLimit.',
        `setLimit(${limit + nbItemsPerPage}).`,
        'exlimit:', limit,
      ); */
      setLimit(limit + nbItemsPerPage);
      setLoading(true);
    }
  };

  const handleNewSearch = useCallback((newSearch: ISearch): void => {
    if (JSON.stringify(newSearch) !== JSON.stringify(search)) {
      /* console.log(
        'From SearchList, handleNewSearch.',
        `setLoading(true) + setSearch(${JSON.stringify(newSearch)}).`,
      ); */
      setLoading(true);
      setSearch(newSearch);
    }
  }, [search]);

  const handleSort = (sortCriterion: ISortCriterion<ISong>) => (): void => {
    let sortValue: ISortSpecifierValue;
    if (sort && sort[sortCriterion]) {
      sortValue = sort[sortCriterion] === -1 ? undefined : -1;
    } else {
      sortValue = 1;
    }
    setSort({
      /* ...sort, // If a multicriteria sorting is needed. */
      [sortCriterion]: sortValue,
    } as unknown as ISortSpecifier<ISong>);
  };

  const handleToggleDisplaySort = (open?: boolean) => (): void => {
    setSort(undefined);
    setDisplaySort(open === undefined ? !displaySort : open);
  };

  const handleToggleFavoriteSong = (songId: Mongo.ObjectID, value?: boolean) => (): void => {
    /* console.log(
      'From SearchList, handleToggleFavoriteSong.',
      '{ songId, value }:', { songId, value },
    ); */
    userFavoriteToggle.call({ songId, value });
  };

  return (
    <div className={hidden ? classes.hidden : classes.root}>
      <SearchField
        displaySort={displaySort}
        handleNewSearch={handleNewSearch}
        handleToggleDisplaySort={handleToggleDisplaySort}
        loading={loading}
      />
      <SongList
        displayFavorite={isAuthenticated}
        displaySort={displaySort}
        emptyListPlaceholder={<SearchListNoResult search={search} />}
        favoriteSongs={favoriteSongs}
        handleSelectSong={handleSelectSong}
        handleSort={handleSort}
        handleToggleDisplaySort={handleToggleDisplaySort}
        handleToggleFavoriteSong={handleToggleFavoriteSong}
        loading={loading}
        raiseLimit={songs.length === limit ? raiseLimit : undefined}
        secondaryActions={secondaryActions}
        songs={songs}
        sort={sort}
      />
    </div>
  );
};

export default SearchList;

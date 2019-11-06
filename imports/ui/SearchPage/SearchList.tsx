import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { withTracker } from 'meteor/react-meteor-data';
import React, { useState, useEffect } from 'react';

import { makeStyles } from '@material-ui/core';

import SearchField from './SearchField';
import SongList from '../SongList/SongList';
import SearchListNoResult from './SearchListNoResult';

import { ISong, IUser } from '../../types';
import {
  ISearch,
  ISortSpecifier,
  ISortSpecifierValue,
  ISortCriterion,
} from '../../types/searchTypes';

import Songs from '../../api/songs/songs';
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
  handleFocus: (focus?: boolean) => () => void;
  handleSelectSong: (song: ISong) => void;
  hidden?: boolean;
  logoMenuDeployed?: boolean;
}
interface ISearchListWTData {
  favoriteSongs: Mongo.ObjectID[];
  isAuthenticated: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  meteorCall: (method: string, ...rest: any[]) => void;
  songs: ISong[];
}
interface IWrappedSearchListProps
  extends ISearchListProps, ISearchListWTData { }

export const WrappedSearchList: React.FC<IWrappedSearchListProps> = ({
  favoriteSongs,
  handleFocus,
  handleSelectSong,
  hidden = false,
  isAuthenticated,
  logoMenuDeployed,
  meteorCall,
  songs,
}) => {
  const classes = useStyles();

  const [displaySort, setDisplaySort] = useState(false);
  const [limit, setLimit] = useState(nbItemsPerPage);
  const [limitRaised, setLimitRaised] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState<ISortSpecifier | undefined>(undefined);
  const [search, setSearch] = useState();

  console.log('From SearchList, render. loading:', loading, 'songs[0]:', songs[0] && songs[0].title);

  useEffect(() => {
    if (search
      && (search.globalQuery
        || (search.specificQueries && Object.keys(search.specificQueries).length)
      )
    ) {
      const { query, options } = buildQuery({ search, options: { limit, sort } });

      console.log('From SearchList, useEffect[search, sort]: subscription with { query, options }:', JSON.stringify({ query, options }));

      const subscription = Meteor.subscribe('songs', { query, options }, () => {
        console.log('From SearchList, useEffect[search, sort], subscription callback. setLoading(false) + setLimitRaised(false).');
        setLoading(false);
        setLimitRaised(false);
      });
      return (): void => {
        console.log('From SearchList, useEffect[search, sort] return. Stop subscriptions.');
        subscription.stop();
      };
    }
    console.log('From Songlist, useEffect[search, sort]. Empty search: stopLoading().');
    setLoading(false);
    return (): void => { };
  }, [search, sort]);

  useEffect(() => {
    setLimit(nbItemsPerPage);
  }, [search]);

  const raiseLimit = (): void => {
    if (songs.length === limit) {
      console.log(`From SearchList, raiseLimit: setLimitRaised(true) + setLimit(${limit + nbItemsPerPage}). exlimit:`, limit);
      setLimitRaised(true);
      setLimit(limit + nbItemsPerPage);
    }
  };

  const handleNewSearch = (newSearch: ISearch): void => {
    if (JSON.stringify(newSearch) !== JSON.stringify(search)) {
      console.log('From SearchList, handleNewSearch : setLoading(true) + setSearch(', JSON.stringify(newSearch), ').');
      setLoading(true);
      setSearch(newSearch);
    }
  };

  const handleSort = (sortCriterion: ISortCriterion) => (): void => {
    let sortValue: ISortSpecifierValue;
    if (sort && sort[sortCriterion]) {
      sortValue = sort[sortCriterion] === -1 ? undefined : -1;
    } else {
      sortValue = 1;
    }
    setSort({
      /* ...sort, // If a multicriteria sorting is needed. */
      [sortCriterion]: sortValue,
    } as unknown as ISortSpecifier);
  };

  const handleToggleDisplaySort = (open?: boolean) => (): void => {
    setSort(undefined);
    setDisplaySort(open === undefined ? !displaySort : open);
  };

  const handleToggleFavoriteSong = (songId: Mongo.ObjectID, value?: boolean) => (): void => {
    console.log('From SearchList, handleToggleFavoriteSong. { songId, value }:', { songId, value });
    meteorCall('user.favoriteSong.toggle', { songId, value });
  };

  return (
    <div className={hidden ? classes.hidden : classes.root}>
      <SearchField
        displaySort={displaySort}
        logoMenuDeployed={logoMenuDeployed || false}
        handleFocus={handleFocus}
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
        loading={limitRaised || loading}
        raiseLimit={raiseLimit}
        songs={songs}
        sort={sort}
      />
    </div>
  );
};

const SearchList = withTracker<ISearchListWTData, ISearchListProps>(() => {
  const user = Meteor.user() as IUser;

  return {
    favoriteSongs: user ? user.favoriteSongs : [],
    isAuthenticated: !!user,
    meteorCall: Meteor.call,
    songs: Songs.find({}).fetch(),
  };
})(WrappedSearchList);

export default SearchList;

import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { withTracker } from 'meteor/react-meteor-data';
import React, { createRef, useState, useEffect } from 'react';

import SearchField from '../SongList/SearchField';
import SongList from '../SongList/SongList';
import {
  IQueryOptions,
  ISearch,
  ISong,
  ISortSpecifier,
  ISortSpecifierValue,
  IUser,
} from '../../types';
import Songs from '../../api/songs/songs';

const nbItemsPerPage = 20;

interface ISearchListProps {
  handleFocus: (focus?: boolean) => () => void;
  handleSelectSong: (song: ISong) => void;
  logoMenuDeployed?: boolean;
  smallDevice: boolean;
}
interface ISearchListWTData {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  meteorCall: (method: string, ...rest: any[]) => void;
  favoriteSongs: Mongo.ObjectID[];
  isAuthenticated: boolean;
}
interface IWrappedSearchListProps
  extends ISearchListProps, ISearchListWTData { }

export const WrappedSearchList: React.FC<IWrappedSearchListProps> = ({
  favoriteSongs,
  handleFocus,
  handleSelectSong,
  isAuthenticated,
  logoMenuDeployed,
  meteorCall,
  smallDevice,
}) => {
  const listRef = createRef<HTMLElement>();

  const [displaySort, setDisplaySort] = useState(false);
  const [limit, setLimit] = useState(nbItemsPerPage);
  const [limitRaised, setLimitRaised] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState<ISortSpecifier | undefined>(undefined);
  const [search, setSearch] = useState();
  const [songs, setSongs] = useState<ISong[]>([]);
  const [subscriptions, setSubscriptions] = useState<Meteor.SubscriptionHandle[]>([]);

  console.log('From SearchList. render. sort:', sort, 'limit:', limit);

  const updateSubscription = (): (() => void) => {
    setLoading(true);
    const newSubscriptions = subscriptions;
    const options: IQueryOptions = { limit, sort };
    console.log('From SearchList, updateSubscription. search:', { search, options });
    const newSubscription = Meteor.subscribe('songs', { search, options }, () => {
      const updatedSongs = Songs.find({}).fetch() as ISong[];
      setSongs(updatedSongs);
      console.log('From SearchList, updateSubscription, subscription callback. updatedSongs.length:', updatedSongs.length);
      setLoading(false);
      setLimitRaised(false);
    });
    newSubscriptions.push(newSubscription);
    setSubscriptions(newSubscriptions);
    return (): void => {
      console.log('From SearchList, updateSubscription return. Stop subscriptions.');
      subscriptions.forEach((subscription) => subscription.stop());
      setSongs([]);
    };
  };

  useEffect(updateSubscription, [sort]);
  useEffect(() => {
    console.log('From SearchList, useEffect[search]. listRef:', listRef);
    console.log('From SearchList, useEffect[search].');
    setLimit(nbItemsPerPage);
    if (search
      && (search.globalQuery
        || (search.specificQueries && Object.keys(search.specificQueries).length)
      )
    ) {
      return updateSubscription();
    }
    console.log('From Songlist, useEffect. empty search. stopLoading().');
    setLoading(false);
    return (): void => { };
  }, [search]);

  const raiseLimit = (): void => {
    if (songs.length === limit) {
      setLimitRaised(true);
      setLimit(limit + nbItemsPerPage);
      updateSubscription();
    }
  };

  const handleNewSearch = (newSearch: ISearch): void => {
    console.log('From SearchPage, handleNewSearch. newSearch:', newSearch, 'search:', search);
    if (JSON.stringify(newSearch) !== JSON.stringify(search)) {
      setLoading(true);
      setSearch(newSearch);
      console.log('From SearchPage, handleNewSearch. newSearch. loading:', loading, 'search:', search);
    }
  };

  const handleSort = (sortCriterion: string) => (): void => {
    let sortValue: ISortSpecifierValue;
    if (sort && sort[sortCriterion]) {
      sortValue = sort[sortCriterion] === -1 ? undefined : -1;
    } else {
      sortValue = 1;
    }
    setSort({
      /* ...sort, // If a multicriteria sorting is needed. */
      [sortCriterion]: sortValue,
    });
  };

  const handleToggleDisplaySort = (open?: boolean) => (): void => {
    setSort(undefined);
    setDisplaySort(open || !displaySort);
  };

  const handleToggleFavorite = (songId: Mongo.ObjectID, value?: boolean) => (): void => {
    console.log('From SearchList, handleToggleFavorite. { songId, value }:', { songId, value });
    meteorCall('user.favoriteSong.toggle', { songId, value });
  };

  return (
    <>
      <SearchField
        displaySort={displaySort}
        logoMenuDeployed={logoMenuDeployed || false}
        handleFocus={handleFocus}
        handleNewSearch={handleNewSearch}
        handleToggleDisplaySort={handleToggleDisplaySort}
        loading={loading}
      />
      <SongList
        displaySort={displaySort}
        favoriteSongs={favoriteSongs}
        handleFocus={handleFocus}
        handleSelectSong={handleSelectSong}
        handleSort={handleSort}
        handleToggleDisplaySort={handleToggleDisplaySort}
        handleToggleFavorite={handleToggleFavorite}
        isAuthenticated={isAuthenticated}
        loading={limitRaised || loading}
        raiseLimit={raiseLimit}
        search={search}
        smallDevice={smallDevice}
        songs={songs}
        sort={sort}
      />
    </>
  );
};

const SearchList = withTracker<ISearchListWTData, ISearchListProps>(() => {
  const isAuthenticated = !!Meteor.userId();
  if (isAuthenticated) {
    Meteor.subscribe('user.favoriteSongs');
  }
  const user = Meteor.user() as IUser;
  const favoriteSongs = user && user.favoriteSongs;

  return {
    favoriteSongs,
    isAuthenticated,
    meteorCall: Meteor.call,
  };
})(WrappedSearchList);

export default SearchList;

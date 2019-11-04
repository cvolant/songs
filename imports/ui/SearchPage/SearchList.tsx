import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { withTracker } from 'meteor/react-meteor-data';
import React, { useState, useEffect } from 'react';

import SearchField from './SearchField';
import SongList from '../SongList/SongList';
import SearchListNoResult from './SearchListNoResult';
import {
  ISearch,
  ISong,
  ISortSpecifier,
  ISortSpecifierValue,
  IUser,
  ISortCriterion,
} from '../../types';
import Songs from '../../api/songs/songs';
import buildQuery from './buildQuery';

const nbItemsPerPage = 20;

interface ISearchListProps {
  handleFocus: (focus?: boolean) => () => void;
  handleSelectSong: (song: ISong) => void;
  logoMenuDeployed?: boolean;
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
}) => {
  const [displaySort, setDisplaySort] = useState(false);
  const [limit, setLimit] = useState(nbItemsPerPage);
  const [limitRaised, setLimitRaised] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState<ISortSpecifier | undefined>(undefined);
  const [search, setSearch] = useState();
  const [songs, setSongs] = useState<ISong[]>([]);
  const [subscriptions, setSubscriptions] = useState<Meteor.SubscriptionHandle[]>([]);

  const updateSubscription = (newSubscriptionOptions: {
    limit?: number;
    sort?: ISortSpecifier;
  } = {}): (() => void) => {
    const newSubscriptions = subscriptions;
    console.log('From SearchList, updateSubscription. limit:', limit);
    const {
      mongo: { query, options },
      minimongo,
    } = buildQuery({ search, options: newSubscriptionOptions });
    console.log('From SearchList, updateSubscription. { query, options }:', { query, options });
    const newSubscription = Meteor.subscribe('songs', { query, options }, () => {
      const updatedSongs = Songs.find(minimongo.query, minimongo.options).fetch() as ISong[];
      setSongs(updatedSongs);
      console.log('From SearchList, updateSubscription, subscription callback. updatedSongs.length:', updatedSongs.length, 'Songs:', Songs, 'query:', query, 'options:', options, 'minimongo:', minimongo);
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
    console.log('From SearchList, useEffect[search].');
    setLimit(nbItemsPerPage);
    if (search
      && (search.globalQuery
        || (search.specificQueries && Object.keys(search.specificQueries).length)
      )
    ) {
      setLoading(true);
      return updateSubscription();
    }
    console.log('From Songlist, useEffect. empty search. stopLoading().');
    setLoading(false);
    return (): void => { };
  }, [search]);

  const raiseLimit = (): void => {
    console.log('From SearchList, raiseLimit. songs.length:', songs.length, 'limit:', limit);
    if (songs.length === limit) {
      setLimitRaised(true);
      const newLimit = limit + nbItemsPerPage;
      console.log('From SearchList, raiseLimit. limit:', limit, 'newLimit:', newLimit);
      setLimit(newLimit);
      updateSubscription({ limit: newLimit });
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
        emptyListPlaceholder={<SearchListNoResult search={search} />}
        favoriteSongs={favoriteSongs}
        handleSelectSong={handleSelectSong}
        handleSort={handleSort}
        handleToggleDisplaySort={handleToggleDisplaySort}
        handleToggleFavoriteSong={handleToggleFavoriteSong}
        isAuthenticated={isAuthenticated}
        loading={limitRaised || loading}
        raiseLimit={raiseLimit}
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

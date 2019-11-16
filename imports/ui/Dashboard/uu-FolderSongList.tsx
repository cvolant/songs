import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { withTracker } from 'meteor/react-meteor-data';
import React, { ReactNode, useState, useEffect } from 'react';

import SongList from '../Songs/SongList';

import { ISong, IUser } from '../../types';
import {
  ISortCriterion,
  ISortSpecifier,
  ISortSpecifierValue,
} from '../../types/searchTypes';

import Songs from '../../api/songs/songs';

const nbItemsPerPage = 20;

type IFolderSongListName = keyof IUser & 'favoriteSongs' | 'createdSongs';
interface IFolderSongListProps {
  displaySort?: boolean;
  emptyListPlaceholder: ReactNode;
  handleToggleDisplaySort: (display?: boolean) => () => void;
  logoMenuDeployed?: boolean;
  userSongList?: IFolderSongListName;
}
interface IFolderSongListWTData {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  meteorCall: (method: string, ...rest: any[]) => void;
  favoriteSongs: Mongo.ObjectID[];
  user: Meteor.User | null;
}
interface IWrappedFolderSongListProps
  extends IFolderSongListProps, IFolderSongListWTData { }

export const WrappedFolderSongList: React.FC<IWrappedFolderSongListProps> = ({
  displaySort = false,
  emptyListPlaceholder,
  favoriteSongs,
  handleToggleDisplaySort,
  logoMenuDeployed,
  meteorCall,
  userSongList = 'favoriteSongs',
  user,
}) => {
  const [limit, setLimit] = useState(nbItemsPerPage);
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState<ISortSpecifier<ISong> | undefined>(undefined);
  const [songs, setSongs] = useState<ISong[]>([]);
  const [subscriptions, setSubscriptions] = useState<Meteor.SubscriptionHandle[]>([]);

  const updateSubscription = (newSubscriptionOptions: {
    limit?: number;
    sort?: ISortSpecifier<ISong>;
  } = {}): (() => void) => {
    setLoading(true);
    const newSubscriptions = subscriptions;
    console.log('From FolderSongList, updateSubscription. limit:', limit, 'user:', user || 'no-user', 'user[userSongList]:', user ? (user as IUser)[userSongList] : 'no-user');
    const newSubscription = Meteor.subscribe(`user.${userSongList}`, newSubscriptionOptions, () => {
      const updatedSongs = Songs.find({
        _id: {
          $in: user ? ((user as IUser)[userSongList] || []) : [],
        },
      }, { sort: sort || { updatedAt: -1 } }).fetch() as ISong[];
      setSongs(updatedSongs);
      console.log('From SongList, updateSubscription, subscription callback. updatedSongs.length:', updatedSongs.length, 'userSongList:', userSongList, 'Songs:', Songs);
      setLoading(false);
    });
    newSubscriptions.push(newSubscription);
    setSubscriptions(newSubscriptions);
    return (): void => {
      console.log('From FolderSongList, updateSubscription return. Stop subscriptions.');
      subscriptions.forEach((subscription) => subscription.stop());
      setSongs([]);
    };
  };

  useEffect(updateSubscription, [
    sort,
    userSongList,
    user && ((user as IUser)[userSongList] || []).join(),
  ]);

  const raiseLimit = (): void => {
    console.log('From FolderSongList, raiseLimit. songs.length:', songs.length, 'limit:', limit);
    if (songs.length === limit) {
      setLoading(true);
      const newLimit = limit + nbItemsPerPage;
      console.log('From FolderSongList, raiseLimit. limit:', limit, 'newLimit:', newLimit);
      setLimit(newLimit);
      updateSubscription({ limit: newLimit });
    }
  };

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

  const handleToggleFavoriteSong = (songId: Mongo.ObjectID, value?: boolean) => (): void => {
    console.log('From FolderSongList, handleToggleFavoriteSong. { songId, value }:', { songId, value });
    meteorCall('user.favoriteSong.toggle', { songId, value });
  };

  return (
    <SongList
      displayFavorite
      displaySort={displaySort}
      emptyListPlaceholder={emptyListPlaceholder}
      favoriteSongs={favoriteSongs}
      handleSort={handleSort}
      handleToggleDisplaySort={handleToggleDisplaySort}
      handleToggleFavoriteSong={handleToggleFavoriteSong}
      loading={loading}
      raiseLimit={raiseLimit}
      shortFirstItem={logoMenuDeployed}
      songs={songs}
      sort={sort}
    />
  );
};

const FolderSongList = withTracker<IFolderSongListWTData, IFolderSongListProps>(() => {
  const user = Meteor.user() as IUser;
  const favoriteSongs = user && user.favoriteSongs;

  return {
    favoriteSongs,
    meteorCall: Meteor.call,
    user: Meteor.user(),
  };
})(WrappedFolderSongList);

export default FolderSongList;

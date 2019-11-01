import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { withTracker } from 'meteor/react-meteor-data';
import React, { ReactNode, useState, useEffect } from 'react';

import SongList from '../SongList/SongList';
import {
  ISong,
  ISortCriterion,
  ISortSpecifier,
  ISortSpecifierValue,
  IUser,
} from '../../types';
import Songs from '../../api/songs/songs';

const nbItemsPerPage = 20;

type IUserSongListName = keyof IUser & 'favoriteSongs' | 'createdSongs';
interface IUserSongListProps {
  displaySort?: boolean;
  emptyListPlaceholder: ReactNode;
  handleToggleDisplaySort: (display?: boolean) => () => void;
  logoMenuDeployed?: boolean;
  userSongList?: IUserSongListName;
}
interface IUserSongListWTData {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  meteorCall: (method: string, ...rest: any[]) => void;
  favoriteSongs: Mongo.ObjectID[];
  user: Meteor.User | null;
}
interface IWrappedUserSongListProps
  extends IUserSongListProps, IUserSongListWTData { }

export const WrappedUserSongList: React.FC<IWrappedUserSongListProps> = ({
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
  const [sort, setSort] = useState<ISortSpecifier | undefined>(undefined);
  const [songs, setSongs] = useState<ISong[]>([]);
  const [subscriptions, setSubscriptions] = useState<Meteor.SubscriptionHandle[]>([]);

  const updateSubscription = (newSubscriptionOptions: {
    limit?: number;
    sort?: ISortSpecifier;
  } = {}): (() => void) => {
    setLoading(true);
    const newSubscriptions = subscriptions;
    console.log('From UserSongList, updateSubscription. limit:', limit, 'user:', user || 'no-user', 'user[userSongList]:', user ? (user as IUser)[userSongList] : 'no-user');
    const newSubscription = Meteor.subscribe(`user.${userSongList}`, newSubscriptionOptions, () => {
      const updatedSongs = Songs.find({
        _id: {
          $in: user ? ((user as IUser)[userSongList] || []) : [],
        },
      }, { sort: { updatedAt: -1 } }).fetch() as ISong[];
      setSongs(updatedSongs);
      console.log('From SongList, updateSubscription, subscription callback. updatedSongs.length:', updatedSongs.length, 'userSongList:', userSongList, 'Songs:', Songs);
      setLoading(false);
    });
    newSubscriptions.push(newSubscription);
    setSubscriptions(newSubscriptions);
    return (): void => {
      console.log('From UserSongList, updateSubscription return. Stop subscriptions.');
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
    console.log('From UserSongList, raiseLimit. songs.length:', songs.length, 'limit:', limit);
    if (songs.length === limit) {
      setLoading(true);
      const newLimit = limit + nbItemsPerPage;
      console.log('From UserSongList, raiseLimit. limit:', limit, 'newLimit:', newLimit);
      setLimit(newLimit);
      updateSubscription({ limit: newLimit });
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

  const handleToggleFavoriteSong = (songId: Mongo.ObjectID, value?: boolean) => (): void => {
    console.log('From UserSongList, handleToggleFavoriteSong. { songId, value }:', { songId, value });
    meteorCall('user.favoriteSong.toggle', { songId, value });
  };

  return (
    <>
      <SongList
        displaySort={displaySort}
        emptyListPlaceholder={emptyListPlaceholder}
        favoriteSongs={favoriteSongs}
        handleSort={handleSort}
        handleToggleDisplaySort={handleToggleDisplaySort}
        handleToggleFavoriteSong={handleToggleFavoriteSong}
        isAuthenticated
        loading={loading}
        logoMenuDeployed={logoMenuDeployed}
        raiseLimit={raiseLimit}
        smallDevice
        songs={songs}
        sort={sort}
      />
    </>
  );
};

const UserSongList = withTracker<IUserSongListWTData, IUserSongListProps>(() => {
  Meteor.subscribe('user.favoriteSongs');
  const user = Meteor.user() as IUser;
  const favoriteSongs = user && user.favoriteSongs;

  return {
    favoriteSongs,
    meteorCall: Meteor.call,
    user: Meteor.user(),
  };
})(WrappedUserSongList);

export default UserSongList;

import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { withTracker } from 'meteor/react-meteor-data';
import React, { ReactNode, useState, useEffect } from 'react';

import SongList from '../Songs/SongList';
import UserCollectionName from './UserCollectionName';

import { ISong, IUser } from '../../types';
import {
  ISortCriterion,
  ISortSpecifier,
  ISortSpecifierValue,
} from '../../types/searchTypes';

import Songs from '../../api/songs/songs';
import { IUnfetchedSong } from '../../types/songTypes';
import { IUnfetchedFolder } from '../../types/folderTypes';
import { IArrayIconButtonProps } from '../../types/iconButtonTypes';

import { userToggleFavorite } from '../../api/users/methods';

const nbItemsPerPage = 20;

interface IUserSongListProps {
  displaySort?: boolean;
  emptyListPlaceholder: ReactNode;
  folder?: IUnfetchedFolder;
  handleToggleDisplaySort: (display?: boolean) => () => void;
  handleSelectSong: (song: IUnfetchedSong) => void;
  logoMenuDeployed?: boolean;
  secondaryActions?: IArrayIconButtonProps[];
  user: IUser | null;
  userSongList?: UserCollectionName;
}
interface IUserSongListWTData {
  favoriteSongs: Mongo.ObjectID[];
  songs: ISong[];
}
interface IWrappedUserSongListProps
  extends IUserSongListProps, IUserSongListWTData { }

export const WrappedUserSongList: React.FC<IWrappedUserSongListProps> = ({
  displaySort = false,
  emptyListPlaceholder,
  favoriteSongs,
  folder,
  handleToggleDisplaySort,
  logoMenuDeployed,
  handleSelectSong,
  secondaryActions,
  songs,
  userSongList = UserCollectionName.FavoriteSongs,
}) => {
  const [limit, setLimit] = useState(nbItemsPerPage);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<ISortSpecifier<ISong> | undefined>(undefined);

  useEffect((): (() => void) => {
    setLoading(true);
    const endOfLoading = (): void => {
      console.log('From UserSongList, useEffect, endOfLoading.');
      setLoading(false);
    };
    const subscription = userSongList === UserCollectionName.Folders && folder && folder._id
      ? Meteor.subscribe('songs.inFolder', { folder, options: { limit, sort } }, endOfLoading)
      : Meteor.subscribe(`user.${userSongList}`, { limit, sort }, endOfLoading);
    console.log('From UserSongList, useEffect. userSongList:', userSongList, 'folder:', folder, 'subscription:', subscription);
    return (): void => {
      subscription.stop();
    };
  }, [sort, userSongList]);

  const raiseLimit = (): void => {
    console.log('From UserSongList, raiseLimit. songs.length:', songs.length, 'limit:', limit);
    if (songs.length === limit) {
      setLoading(true);
      const newLimit = limit + nbItemsPerPage;
      console.log('From UserSongList, raiseLimit. limit:', limit, 'newLimit:', newLimit);
      setLimit(newLimit);
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
    console.log('From UserSongList, handleToggleFavoriteSong. { songId, value }:', { songId, value });
    userToggleFavorite.call({ songId, value });
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
      handleSelectSong={handleSelectSong}
      secondaryActions={secondaryActions}
      shortFirstItem={logoMenuDeployed}
      songs={songs}
      sort={sort}
    />
  );
};

const UserSongList = withTracker<IUserSongListWTData, IUserSongListProps>(({
  userSongList = UserCollectionName.FavoriteSongs, folder, user,
}) => {
  const songIds = userSongList === UserCollectionName.Folders
    ? (folder && folder.songs && folder.songs.map((song) => song._id)) || []
    : (user && user[userSongList]) || [];
  const favoriteSongs = (user && user.favoriteSongs) || [];
  console.log('From UserSongList, withTracker. folder:', folder, 'favoriteSongs:', favoriteSongs, 'user:', user);
  return {
    favoriteSongs,
    songs: Songs.find({ _id: { $in: songIds } }).fetch(),
  };
})(WrappedUserSongList);

export default UserSongList;

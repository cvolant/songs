import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { withTracker } from 'meteor/react-meteor-data';
import React, { ReactNode, useState, useEffect } from 'react';

import SongList from '../SongList/SongList';

import { ISong, IUser } from '../../types';
import {
  ISortCriterion,
  ISortSpecifier,
  ISortSpecifierValue,
} from '../../types/searchTypes';

import Songs from '../../api/songs/songs';
import { IUnfetchedSong } from '../../types/songTypes';
import { IUnfetchedFolder } from '../../types/folderTypes';

const nbItemsPerPage = 20;

type IUserSongListName = 'favoriteSongs' | 'createdSongs' | 'folderSongs';
interface IUserSongListProps {
  displaySort?: boolean;
  emptyListPlaceholder: ReactNode;
  folder?: IUnfetchedFolder;
  handleToggleDisplaySort: (display?: boolean) => () => void;
  logoMenuDeployed?: boolean;
  handleSelectSong: (song: IUnfetchedSong) => void;
  userSongList?: IUserSongListName;
}
interface IUserSongListWTData {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  meteorCall: (method: string, ...rest: any[]) => void;
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
  meteorCall,
  handleSelectSong,
  songs,
  userSongList = 'favoriteSongs',
}) => {
  const [limit, setLimit] = useState(nbItemsPerPage);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<ISortSpecifier | undefined>(undefined);

  useEffect((): (() => void) => {
    setLoading(true);
    const endOfLoading = (): void => {
      console.log('From UserSongList, useEffect, endOfLoading.');
      setLoading(false);
    };
    const subscription = userSongList === 'folderSongs' && folder && folder._id
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
    <SongList
      displayFavorite
      displaySort={displaySort}
      emptyListPlaceholder={emptyListPlaceholder}
      favoriteSongs={favoriteSongs}
      handleSort={handleSort}
      handleToggleDisplaySort={handleToggleDisplaySort}
      handleToggleFavoriteSong={handleToggleFavoriteSong}
      loading={loading}
      logoMenuDeployed={logoMenuDeployed}
      raiseLimit={raiseLimit}
      handleSelectSong={handleSelectSong}
      songs={songs}
      sort={sort}
    />
  );
};

const UserSongList = withTracker<IUserSongListWTData, IUserSongListProps>(({
  userSongList = 'favoriteSongs', folder,
}) => {
  const user = Meteor.user() as IUser;
  console.log('From UserSongList, withTracker. folder:', folder, 'folder && folder.songs && folder.songs.map((song) => song._id):', folder && folder.songs && folder.songs.map((song) => song._id), 'Songs:', Songs);
  const songIds = userSongList === 'folderSongs'
    ? (folder && folder.songs && folder.songs.map((song) => song._id)) || []
    : (user && user[userSongList]) || [];
  return {
    favoriteSongs: user ? user.favoriteSongs : [],
    meteorCall: Meteor.call,
    songs: Songs.find({ _id: { $in: songIds } }).fetch(),
  };
})(WrappedUserSongList);

export default UserSongList;

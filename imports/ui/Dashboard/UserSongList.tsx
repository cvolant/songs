import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { useTracker } from 'meteor/react-meteor-data';
import React, { ReactNode, useState, useEffect } from 'react';

import SongList from '../Songs/SongList';
import UserCollectionName from './UserCollectionName';

import {
  IFolder,
  ISong,
  IUnfetched,
  IUser,
} from '../../types';
import {
  ISortCriterion,
  ISortSpecifier,
  ISortSpecifierValue,
} from '../../types/searchTypes';

import Songs from '../../api/songs/songs';
import { IArrayIconButtonProps } from '../../types/iconButtonTypes';

import { userFavoriteToggle } from '../../api/users/methods';

const nbItemsPerPage = 20;

interface IUserSongListProps {
  displaySort?: boolean;
  emptyListPlaceholder: ReactNode;
  folder?: IUnfetched<IFolder>;
  handleToggleDisplaySort: (display?: boolean) => () => void;
  handleSelectSong: (song: IUnfetched<ISong>) => void;
  logoMenuDeployed?: boolean;
  secondaryActions?: IArrayIconButtonProps<IUnfetched<ISong>>[];
  user: IUser | null;
  userSongList?: UserCollectionName;
}

export const UserSongList: React.FC<IUserSongListProps> = ({
  displaySort = false,
  emptyListPlaceholder,
  folder,
  handleToggleDisplaySort,
  logoMenuDeployed,
  handleSelectSong,
  secondaryActions,
  user,
  userSongList = UserCollectionName.FavoriteSongs,
}) => {
  const [limit, setLimit] = useState(nbItemsPerPage);
  const [favoriteSongs, setFavoriteSongs] = useState<Mongo.ObjectID[]>([]);
  const [loading, setLoading] = useState(true);
  const [songs, setSongs] = useState<ISong[]>([]);
  const [sort, setSort] = useState<ISortSpecifier<ISong> | undefined>(undefined);

  useEffect((): (() => void) => {
    setLoading(true);
    const endOfLoading = (): void => {
      // console.log('From UserSongList, useEffect, endOfLoading.');
      setLoading(false);
    };
    const subscription = userSongList === UserCollectionName.Folders && folder && folder._id
      ? Meteor.subscribe('songs.inFolder', { folder, options: { limit, sort } }, endOfLoading)
      : Meteor.subscribe(`user.${userSongList}`, { limit, sort }, endOfLoading);

    /* console.log(
      'From UserSongList, useEffect.',
      'userSongList:', userSongList,
      'folder:', folder,
      'subscription:', subscription,
    ); */
    return subscription.stop;
  }, [folder, limit, sort, userSongList]);

  useTracker(() => {
    let uTFavoriteSongs: Mongo.ObjectID[] = [];
    let uTSongs: ISong[] = [];

    if (!loading) {
      const songIds = userSongList === UserCollectionName.Folders
        ? (folder && folder.songs && folder.songs.map((song) => song._id)) || []
        : (user && user[userSongList]) || [];
      uTFavoriteSongs = (user && user.favoriteSongs) || [];
      uTSongs = Songs.find({ _id: { $in: songIds } }).fetch();

      setFavoriteSongs(uTFavoriteSongs);
      setSongs(uTSongs);
    }
    return { uTFavoriteSongs, uTSongs }; // Unused.
  }, [folder, loading, user, userSongList]);

  useEffect(() => {
    setLimit(nbItemsPerPage);
  }, [userSongList]);

  const raiseLimit = (): void => {
    // console.log('From UserSongList, raiseLimit. songs.length:', songs.length, 'limit:', limit);
    if (songs.length === limit) {
      setLoading(true);
      const newLimit = limit + nbItemsPerPage;
      // console.log('From UserSongList, raiseLimit. limit:', limit, 'newLimit:', newLimit);
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
    /* console.log(
      'From UserSongList, handleToggleFavoriteSong.',
      '{ songId, value }:', { songId, value },
    ); */
    userFavoriteToggle.call({ songId, value });
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
      raiseLimit={songs.length === limit ? raiseLimit : undefined}
      handleSelectSong={handleSelectSong}
      secondaryActions={secondaryActions}
      shortFirstItem={logoMenuDeployed}
      songs={songs}
      sort={sort}
    />
  );
};

export default UserSongList;

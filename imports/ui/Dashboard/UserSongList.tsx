import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { useTracker } from 'meteor/react-meteor-data';
import React, { ReactNode, useState } from 'react';

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

import { NB_ITEMS_PER_PAGE } from '../../config';

interface IUserSongListProps {
  displaySort?: boolean;
  emptyListPlaceholder: ReactNode;
  folder?: IUnfetched<IFolder>;
  handleToggleDisplaySort: (display?: boolean) => () => void;
  handleSelectSong: (song: IUnfetched<ISong>) => void;
  loading?: boolean;
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
  loading: propLoading,
  logoMenuDeployed,
  handleSelectSong,
  secondaryActions,
  user,
  userSongList = UserCollectionName.FavoriteSongs,
}) => {
  const [limit, setLimit] = useState(NB_ITEMS_PER_PAGE);
  const [sort, setSort] = useState<ISortSpecifier<ISong> | undefined>(undefined);

  const loading = useTracker(
    () => (userSongList === UserCollectionName.Folders && folder && folder._id
      ? !Meteor.subscribe('songs.inFolder', { folder, options: { limit, sort } }).ready()
      : Meteor.subscribe(`user.${userSongList}`, { limit, sort }).ready()),
    [folder, limit, sort, userSongList],
  );

  const { songs, favoriteSongs } = useTracker(() => {
    const songIds = userSongList === UserCollectionName.Folders
      ? (folder && folder.songs && folder.songs.map((song) => song._id)) || []
      : (user && user[userSongList]) || [];

    return {
      songs: Songs.find({ _id: { $in: songIds } }).fetch(),
      favoriteSongs: (user && user.favoriteSongs) || [],
    };
  }, [folder, user, userSongList]);

  const raiseLimit = (): void => {
    // console.log('From UserSongList, raiseLimit. songs.length:', songs.length, 'limit:', limit);
    if (songs.length === limit) {
      const newLimit = limit + NB_ITEMS_PER_PAGE;
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
      loading={loading || propLoading}
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

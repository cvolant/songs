import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import React, { useState, ReactNode, MouseEventHandler } from 'react';
import { useTranslation } from 'react-i18next';

import Eye from '@material-ui/icons/RemoveRedEye';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import QueueMusic from '@material-ui/icons/QueueMusic';

import SongListItemText from './SongListItemText';
import ListLayout from '../ListLayout/ListLayout';
import ListLayoutItem from '../ListLayout/ListLayoutItem';
import ListLayoutSorting from '../ListLayout/ListLayoutSorting';

import { ISong } from '../../types';
import { ISortSpecifier, ISortCriterion } from '../../types/searchTypes';
import {
  IIconColor,
  IArrayIconButtonProps,
} from '../../types/iconButtonTypes';
import { IUnfetchedSong } from '../../types/songTypes';

interface ISongListProps {
  displayFavorite: boolean;
  displaySort: boolean;
  emptyListPlaceholder?: ReactNode;
  favoriteSongs: Mongo.ObjectID[];
  handleSelectSong?: (song: ISong) => void;
  handleSort: (sortCriterion: ISortCriterion<ISong>) => () => void;
  handleToggleDisplaySort: (open?: boolean) => () => void;
  handleToggleFavoriteSong: (songId: Mongo.ObjectID, value?: boolean) => () => void;
  loading?: boolean;
  raiseLimit: () => void;
  secondaryActions?: IArrayIconButtonProps[];
  shortFirstItem?: boolean;
  songs?: ISong[];
  sort?: ISortSpecifier<ISong>;
}

export const SongList: React.FC<ISongListProps> = ({
  displayFavorite,
  displaySort,
  emptyListPlaceholder,
  favoriteSongs,
  handleSelectSong = (): void => { },
  handleSort,
  handleToggleDisplaySort,
  loading = false,
  raiseLimit,
  secondaryActions,
  shortFirstItem = false,
  songs = [],
  sort,
}) => {
  const { t } = useTranslation();

  const [unfoldedSong, setUnfoldedSong] = useState();

  console.log('From SongList, render. Meteor.user():', Meteor.user());

  const handleSelect = (song: ISong) => (): void => handleSelectSong(song);
  const handleUnfold = (songId: Mongo.ObjectID): MouseEventHandler<HTMLDivElement> => (): void => {
    if (songId === unfoldedSong) {
      setUnfoldedSong(undefined);
    } else {
      setUnfoldedSong(songId);
    }
  };

  const handleToggleFavoriteSong = (
    song: IUnfetchedSong,
    callback?: (err: Meteor.Error, res: object) => void,
    params?: { value?: boolean },
  ) => (): void => {
    const value = (params && params.value) || undefined;
    console.log('From SearchList, handleToggleFavoriteSong. { songId, value }:', { songId: song._id, value });
    Meteor.call('user.favoriteSong.toggle', { songId: song._id, value }, callback);
  };

  console.log('From SongList, render. favoriteSongs', favoriteSongs);

  return (
    <ListLayout
      displaySort={displaySort}
      emptyListPlaceholder={emptyListPlaceholder}
      loading={loading}
      listSorting={(songs.length > 0 || loading) ? (
        <ListLayoutSorting
          handleToggleDisplaySort={handleToggleDisplaySort}
          handleSort={handleSort}
          sort={sort}
          sortCriteria={(['title', 'compositor', 'author', 'year'] as ISortCriterion<ISong>[])
            .map((sortCriterion) => ({
              criterion: sortCriterion,
              localCriterionName: t(`song.${sortCriterion}`, sortCriterion),
            }))}
        />
      ) : undefined}
      raiseLimit={raiseLimit}
      shortFirstItem={shortFirstItem}
    >
      {songs.map((song) => {
        const songId = song._id;
        const favorite = favoriteSongs && displayFavorite
          ? !!favoriteSongs
            .find((favoriteSong) => favoriteSong.toHexString() === songId.toHexString())
          : false;

        console.log('From SongList, return, ListLayoutItem. song.title:', song.title, 'favorite?', favorite, 'song._id:', song._id);
        const unfolded = unfoldedSong === songId;
        return (
          <ListLayoutItem
            element={song}
            key={songId.toHexString()}
            listItemText={(
              <SongListItemText
                song={song}
                unfolded={unfolded}
                handleUnfold={handleUnfold(songId)}
              />
            )}
            primaryAction={{
              ariaLabel: t('search.Details', 'Details'),
              Icon: Eye,
              onClick: handleSelect(song),
            }}
            primaryIcon={<QueueMusic />}
            secondaryActions={[
              ...displayFavorite
                ? [{
                  ariaLabel: favorite ? t('search.Unmark as favorite', 'Unmark as favorite') : t('search.Mark as favorite', 'Mark as favorite'),
                  color: favorite ? 'primary' : 'default' as IIconColor,
                  Icon: favorite ? Favorite : FavoriteBorder,
                  key: 'toggleFavorite',
                  onClick: { build: handleToggleFavoriteSong },
                }]
                : [],
              ...secondaryActions || [],
            ]}
            unfolded={unfolded}
          />
        );
      })}
    </ListLayout>
  );
};

export default SongList;

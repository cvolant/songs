import { Mongo } from 'meteor/mongo';
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { action } from '@storybook/addon-actions';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  withKnobs, boolean, text, number,
} from '@storybook/addon-knobs';
import SongList, {
  SongListItem,
  SongListDefaultEmpty,
  SongListSorting,
} from '../imports/ui/SongList';
import SongListItemLoading from '../imports/ui/SongList/SongListItemLoading';

import { ISortSpecifier, ISearch, ISortCriterion } from '../imports/types';
import { songs, users } from './fixtures';

export default {
  title: 'SongList',
  decorators: [withKnobs],
};

type IUseKnobs<T> = (k: {
  text: (name: string, value: string) => string;
  number: (name: string, value: number) => number;
  boolean: (name: string, value: boolean) => boolean;
}) => T;

const kSort: IUseKnobs<ISortSpecifier> = (k) => ({
  [k.text('sortCriterion1', 'title')]: k.number('sortValue1 (1 | -1)', 1),
  [k.text('sortCriterion2', 'subtitle')]: k.number('sortValue2 (1 | -1)', -1),
}) as unknown as ISortSpecifier;
const kSearch: IUseKnobs<ISearch> = (k) => ({
  globalQuery: k.text('globalQuery', 'truc bidule'),
  specificQueries: [
    { [k.text('specificCriterion1', 'title')]: k.text('specificValue1', 'machin') },
    { [k.text('specificCriterion2', 'subtitle')]: k.text('specificValue2', 'chouette') },
  ],
});
const knobs = { text, number, boolean };

export const songListSorting = (): JSX.Element => {
  const sort = kSort(knobs);
  return (
    <SongListSorting
      displayFavorite={boolean('displayFavorite', true)}
      handleToggleDisplaySort={(display?: boolean): () => void => action(`handleToggleDisplaySort(display: ${display})`)}
      handleSort={(sortName?: ISortCriterion): () => void => action(`handleSort(sortName: ${sortName})`)}
      sort={sort}
    />
  );
};

export const songListItem = (): JSX.Element => (
  <SongListItem
    favorite={boolean('favorite', true)}
    handleSelect={action('select')}
    handleToggleFavorite={(value?: boolean): () => void => action(`handleToggleFavorite(value: ${value})`)}
    handleUnfold={action('unfold')}
    displayFavorite={boolean('displayFavorite', true)}
    song={songs[0]}
    unfolded={boolean('unfolded', true)}
  />
);

export const songListEmptyItem = (): JSX.Element => (
  <SongListDefaultEmpty />
);

export const songListItemLoading = (): JSX.Element => (
  <SongListItemLoading />
);

export const songList = (): JSX.Element => {
  const sort = kSort(knobs);
  const search = kSearch(knobs);
  return (
    <SongList
      displayFavorite={boolean('displayFavorite', true)}
      displaySort={boolean('displaySort', true)}
      favoriteSongs={users[0].favoriteSongs}
      handleSelectSong={action('handleSelectSong')}
      handleSort={(sortName?: ISortCriterion): () => void => action(`handleSort(sortName: ${sortName})`)}
      handleToggleDisplaySort={(display?: boolean): () => void => action(`handleToggleDisplaySort(display: ${display})`)}
      handleToggleFavoriteSong={(songId: Mongo.ObjectID, value?: boolean): () => void => action(`handleToggleFavoriteSong(songId: ${songId}, value: ${value})`)}
      loading={boolean('loading', true)}
      logoMenuDeployed={boolean('logoMenuDeployed', true)}
      raiseLimit={action('raiseLimit')}
      search={search}
      songs={boolean('songs', true) ? songs : []}
      sort={sort}
    />
  );
};

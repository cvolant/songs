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
} from '.';
import { Session, song, user } from '../../stories';
import SongListItemLoading from './SongListItemLoading';

import { ISortSpecifier, ISearch, ISortCriterion } from '../../types';

export default {
  title: 'SongList',
  parameters: { Session },
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
      smallDevice={boolean('smallDevice', true)}
    />
  );
};

export const songListItem = (): JSX.Element => (
  <SongListItem
    smallDevice={boolean('smallDevice', true)}
    favorite={boolean('favorite', true)}
    handleSelect={action('select')}
    handleToggleFavorite={(value?: boolean): () => void => action(`handleToggleFavorite(value: ${value})`)}
    handleUnfold={action('unfold')}
    displayFavorite={boolean('displayFavorite', true)}
    song={song}
    unfolded={boolean('unfolded', true)}
  />
);

export const songListEmptyItem = (): JSX.Element => {
  const search = kSearch(knobs);
  return (
    <SongListDefaultEmpty
      search={search}
    />
  );
};
export const songListItemLoading = (): JSX.Element => (
  <SongListItemLoading />
);

export const songList = (): JSX.Element => {
  const sort = kSort(knobs);
  const search = kSearch(knobs);
  return (
    <SongList
      displaySort={boolean('displaySort', true)}
      favoriteSongs={user.favoriteSongs}
      handleSelectSong={action('handleSelectSong')}
      handleSort={(sortName?: ISortCriterion): () => void => action(`handleSort(sortName: ${sortName})`)}
      handleToggleDisplaySort={(display?: boolean): () => void => action(`handleToggleDisplaySort(display: ${display})`)}
      handleToggleFavoriteSong={(songId: Mongo.ObjectID, value?: boolean): () => void => action(`handleToggleFavoriteSong(songId: ${songId}, value: ${value})`)}
      isAuthenticated={boolean('isAuthenticated', true)}
      loading={boolean('loading', true)}
      logoMenuDeployed={boolean('logoMenuDeployed', true)}
      raiseLimit={action('raiseLimit')}
      search={search}
      smallDevice={boolean('smallDevice', true)}
      songs={boolean('songs', true) ? [song, song, song] : []}
      sort={sort}
    />
  );
};

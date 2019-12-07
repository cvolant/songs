import { Mongo } from 'meteor/mongo';
import React from 'react';

import Add from '@material-ui/icons/Add';

// eslint-disable-next-line import/no-extraneous-dependencies
import { action } from '@storybook/addon-actions';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  withKnobs, boolean, text, number,
} from '@storybook/addon-knobs';
import SongList, { SongListItem } from '../imports/ui/Songs';
import SongListSorting from '../imports/ui/ListLayout/ListLayoutSorting';
import SongListItemLoading from '../imports/ui/ListLayout/ListLayoutItemLoading';

import { ISortSpecifier, ISortCriterion } from '../imports/types/searchTypes';
import { ISong } from '../imports/types';
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

const kSort: IUseKnobs<ISortSpecifier<ISong>> = (k) => ({
  [k.text('sortCriterion1', 'title')]: k.number('sortValue1 (1 | -1)', 1),
  [k.text('sortCriterion2', 'subtitle')]: k.number('sortValue2 (1 | -1)', -1),
}) as unknown as ISortSpecifier<ISong>;
const knobs = { text, number, boolean };

export const songListSorting = (): JSX.Element => {
  const sort = kSort(knobs);
  return (
    <SongListSorting
      handleToggleDisplaySort={(display?: boolean): () => void => action(`handleToggleDisplaySort(display: ${display})`)}
      handleSort={(sortName?: ISortCriterion<ISong>): () => void => action(`handleSort(sortName: ${sortName})`)}
      sort={sort}
      sortCriteria={(['title', 'compositor', 'author', 'year'] as ISortCriterion<ISong>[])
        .map((sortCriterion) => ({
          criterion: sortCriterion,
          localCriterionName: sortCriterion,
        }))}
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
    secondaryActions={boolean('secondaryActions', true)
      ? [{
        Icon: Add,
        key: 'rightIcon',
        label: 'rightIcon aria label',
        onClick: action('rightIconClick'),
      }]
      : undefined}
    song={songs[0]}
    unfolded={boolean('unfolded', false)}
  />
);

export const songListItemLoading = (): JSX.Element => (
  <SongListItemLoading />
);

export const songList = (): JSX.Element => {
  const sort = kSort(knobs);
  return (
    <SongList
      displayFavorite={boolean('displayFavorite', true)}
      displaySort={boolean('displaySort', true)}
      favoriteSongs={users[0].favoriteSongs}
      handleSelectSong={action('handleSelectSong')}
      handleSort={(sortName?: ISortCriterion<ISong>): () => void => action(`handleSort(sortName: ${sortName})`)}
      handleToggleDisplaySort={(display?: boolean): () => void => action(`handleToggleDisplaySort(display: ${display})`)}
      handleToggleFavoriteSong={(songId: Mongo.ObjectID, value?: boolean): () => void => action(`handleToggleFavoriteSong(songId: ${songId.toHexString()}, value: ${value})`)}
      loading={boolean('loading', false)}
      shortFirstItem={boolean('shortFistItem', true)}
      raiseLimit={action('raiseLimit')}
      secondaryActions={boolean('secondaryActions', true)
        ? [{
          Icon: Add,
          key: 'rightIcon key',
          label: 'rightIcon aria label',
          onClick: action('rightIconClick'),
        }]
        : undefined}
      songs={boolean('songs', true) ? songs : []}
      sort={sort}
    />
  );
};

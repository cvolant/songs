import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { action } from '@storybook/addon-actions';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  withKnobs, boolean, text, number,
} from '@storybook/addon-knobs';
import FolderList, {
  FolderListItem,
  FolderListDefaultEmpty,
  FolderListSorting,
} from '../imports/ui/FolderList';
import FolderListItemLoading from '../imports/ui/FolderList/FolderListItemLoading';

import { ISortSpecifier, ISortCriterion } from '../imports/types';
import { folders } from './fixtures';

export default {
  title: 'FolderList',
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
const knobs = { text, number, boolean };

export const folderListSorting = (): JSX.Element => {
  const sort = kSort(knobs);
  return (
    <FolderListSorting
      displayFavorite={boolean('displayFavorite', true)}
      handleToggleDisplaySort={(display?: boolean): () => void => action(`handleToggleDisplaySort(display: ${display})`)}
      handleSort={(sortName?: ISortCriterion): () => void => action(`handleSort(sortName: ${sortName})`)}
      sort={sort}
      smallDevice={boolean('smallDevice', true)}
    />
  );
};

export const folderListItem = (): JSX.Element => (
  <FolderListItem
    smallDevice={boolean('smallDevice', true)}
    handleSelect={action('select')}
    handleUnfold={action('unfold')}
    folder={folders[0]}
    unfolded={boolean('unfolded', true)}
  />
);

export const folderListEmptyItem = (): JSX.Element => (
  <FolderListDefaultEmpty />
);

export const folderListItemLoading = (): JSX.Element => (
  <FolderListItemLoading />
);

export const folderList = (): JSX.Element => (
  <FolderList
    handleSelectFolder={action('handleSelectFolder')}
    isAuthenticated={boolean('isAuthenticated', true)}
    loading={boolean('loading', true)}
    logoMenuDeployed={boolean('logoMenuDeployed', true)}
    raiseLimit={action('raiseLimit')}
    smallDevice={boolean('smallDevice', true)}
    folders={boolean('folders', true) ? folders : []}
  />
);

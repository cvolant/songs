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

import { ISortFolderSpecifier, ISortFolderCriterion } from '../imports/types';
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

const kSort: IUseKnobs<ISortFolderSpecifier> = (k) => ({
  [k.text('sortCriterion1', 'date')]: k.number('sortValue1 (1 | -1)', 1),
  [k.text('sortCriterion2', 'name')]: k.number('sortValue2 (1 | -1)', -1),
}) as unknown as ISortFolderSpecifier;
const knobs = { text, number, boolean };

export const folderListSorting = (): JSX.Element => {
  const sort = kSort(knobs);
  return (
    <FolderListSorting
      handleToggleDisplaySort={(display?: boolean): () => void => action(`handleToggleDisplaySort(display: ${display})`)}
      handleSort={(sortName?: ISortFolderCriterion): () => void => action(`handleSort(sortName: ${sortName})`)}
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

export const folderList = (): JSX.Element => {
  const sort = kSort(knobs);
  return (
    <FolderList
      displaySort={boolean('displaySort', true)}
      handleSelectFolder={action('handleSelectFolder')}
      handleSort={(sortName?: ISortFolderCriterion): () => void => action(`handleSort(sortName: ${sortName})`)}
      handleToggleDisplaySort={(display?: boolean): () => void => action(`handleToggleDisplaySort(display: ${display})`)}
      loading={boolean('loading', true)}
      logoMenuDeployed={boolean('logoMenuDeployed', true)}
      raiseLimit={action('raiseLimit')}
      smallDevice={boolean('smallDevice', true)}
      folders={boolean('folders', true) ? folders : []}
      sort={sort}
    />
  );
};

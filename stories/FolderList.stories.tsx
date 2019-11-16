import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { action } from '@storybook/addon-actions';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  withKnobs, boolean, text, number,
} from '@storybook/addon-knobs';
import FolderList, { FolderListItem } from '../imports/ui/Folders';
import FolderListSorting from '../imports/ui/ListLayout/ListLayoutSorting';
import FolderListItemLoading from '../imports/ui/ListLayout/ListLayoutItemLoading';

import { ISortSpecifier, ISortCriterion } from '../imports/types/searchTypes';
import { IFolder } from '../imports/types';

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

const kSort: IUseKnobs<ISortSpecifier<IFolder>> = (k) => ({
  [k.text('sortCriterion1', 'date')]: k.number('sortValue1 (1 | -1)', 1),
  [k.text('sortCriterion2', 'name')]: k.number('sortValue2 (1 | -1)', -1),
}) as unknown as ISortSpecifier<IFolder>;
const knobs = { text, number, boolean };

export const folderListSorting = (): JSX.Element => {
  const sort = kSort(knobs);
  return (
    <FolderListSorting
      handleToggleDisplaySort={(display?: boolean): () => void => action(`handleToggleDisplaySort(display: ${display})`)}
      handleSort={(sortName?: ISortCriterion<IFolder>): () => void => action(`handleSort(sortName: ${sortName})`)}
      sort={sort}
      sortCriteria={(['name', 'updatedAd', 'date'] as ISortCriterion<IFolder>[])
        .map((sortCriterion) => ({
          criterion: sortCriterion,
          localCriterionName: sortCriterion,
        }))}
    />
  );
};

export const folderListItem = (): JSX.Element => (
  <FolderListItem
    handleSelect={action('select')}
    handleUnfold={action('unfold')}
    folder={folders[0]}
    unfolded={boolean('unfolded', false)}
  />
);

export const folderListItemLoading = (): JSX.Element => (
  <FolderListItemLoading />
);

export const folderList = (): JSX.Element => {
  const sort = kSort(knobs);
  return (
    <FolderList
      displaySort={boolean('displaySort', true)}
      folders={boolean('folders', true) ? folders : []}
      handleSelectFolder={action('handleSelectFolder')}
      handleSort={(sortName?: ISortCriterion<IFolder>): () => void => action(`handleSort(sortName: ${sortName})`)}
      handleToggleDisplaySort={(display?: boolean): () => void => action(`handleToggleDisplaySort(display: ${display})`)}
      loading={boolean('loading', false)}
      raiseLimit={action('raiseLimit')}
      shortFirstItem={boolean('shortFirstItem', true)}
      sort={sort}
    />
  );
};

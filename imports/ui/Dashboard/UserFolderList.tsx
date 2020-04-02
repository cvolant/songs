import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import React, { ReactNode, useState } from 'react';

import FolderList from '../Folders/FolderList';

import {
  ISortSpecifierValue,
  ISortCriterion,
  ISortSpecifier,
} from '../../types/searchTypes';
import { IFolder, IUnfetched } from '../../types';

import Folders from '../../api/folders/folders';

const nbItemsPerPage = 20;

interface IUserFolderListProps {
  displaySort?: boolean;
  emptyListPlaceholder?: ReactNode;
  handleToggleDisplaySort: (display?: boolean) => () => void;
  logoMenuDeployed?: boolean;
  handleSelectFolder: (folder: IUnfetched<IFolder>) => void;
}

export const UserFolderList: React.FC<IUserFolderListProps> = ({
  displaySort = false,
  emptyListPlaceholder,
  handleToggleDisplaySort,
  logoMenuDeployed,
  handleSelectFolder,
}) => {
  const [limit, setLimit] = useState(nbItemsPerPage);
  const [sort, setSort] = useState<ISortSpecifier<IFolder> | undefined>(undefined);

  const loading = useTracker(() => !Meteor.subscribe('user.folders', { limit, sort }).ready(), [limit, sort]);
  const folders = useTracker(() => Folders.find().fetch(), []);

  const raiseLimit = (): void => {
    /* console.log(
      'From UserFolderList, raiseLimit.',
      'folders.length:', folders.length,
      'limit:', limit,
    ); */
    if (folders.length === limit) {
      const newLimit = limit + nbItemsPerPage;
      // console.log('From UserFolderList, raiseLimit. limit:', limit, 'newLimit:', newLimit);
      setLimit(newLimit);
    }
  };

  const handleSort = (sortCriterion: ISortCriterion<IFolder>) => (): void => {
    let sortValue: ISortSpecifierValue;
    if (sort && sort[sortCriterion]) {
      sortValue = sort[sortCriterion] === -1 ? undefined : -1;
    } else {
      sortValue = 1;
    }
    setSort({
      /* ...sort, // If a multicriteria sorting is needed. */
      [sortCriterion]: sortValue,
    } as ISortSpecifier<IFolder>);
  };

  return (
    <FolderList
      displaySort={displaySort}
      emptyListPlaceholder={emptyListPlaceholder}
      folders={folders}
      handleSelectFolder={handleSelectFolder}
      handleSort={handleSort}
      handleToggleDisplaySort={handleToggleDisplaySort}
      loading={loading}
      raiseLimit={folders.length === limit ? raiseLimit : undefined}
      shortFirstItem={logoMenuDeployed}
      sort={sort}
    />
  );
};

export default UserFolderList;

import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import React, { ReactNode, useState, useEffect } from 'react';

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
  const [folders, setFolders] = useState<IFolder[]>([]);
  const [limit, setLimit] = useState(nbItemsPerPage);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<ISortSpecifier<IFolder> | undefined>(undefined);

  useEffect((): (() => void) => {
    setLoading(true);
    const subscription = Meteor.subscribe('user.folders', { limit, sort }, () => {
      setLoading(false);
    });
    return subscription.stop;
  }, [limit, sort]);

  useTracker(() => {
    let uTFolders: IFolder[] = [];

    if (!loading) {
      uTFolders = Folders.find().fetch();
      setFolders(uTFolders);
    }

    return uTFolders; // Unused.
  }, [loading]);

  const raiseLimit = (): void => {
    /* console.log(
      'From UserFolderList, raiseLimit.',
      'folders.length:', folders.length,
      'limit:', limit,
    ); */
    if (folders.length === limit) {
      setLoading(true);
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

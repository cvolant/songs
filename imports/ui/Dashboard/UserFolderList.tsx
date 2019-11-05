import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React, { ReactNode, useState, useEffect } from 'react';

import FolderList from '../FolderList/FolderList';

import { ISortSpecifierValue } from '../../types/searchTypes';
import {
  IFolder,
  IUnfetchedFolder,
  ISortFolderCriterion,
  ISortFolderSpecifier,
} from '../../types/folderTypes';

import Folders from '../../api/folders/folders';

const nbItemsPerPage = 20;

interface IUserFolderListProps {
  displaySort?: boolean;
  emptyListPlaceholder: ReactNode;
  handleToggleDisplaySort: (display?: boolean) => () => void;
  logoMenuDeployed?: boolean;
  selectFolder: (song: IUnfetchedFolder) => void;
}
interface IUserFolderListWTData {
  folders: IFolder[];
}
interface IWrappedUserFolderListProps
  extends IUserFolderListProps, IUserFolderListWTData { }

export const WrappedUserFolderList: React.FC<IWrappedUserFolderListProps> = ({
  displaySort = false,
  emptyListPlaceholder,
  folders,
  handleToggleDisplaySort,
  logoMenuDeployed,
  selectFolder,
}) => {
  const [limit, setLimit] = useState(nbItemsPerPage);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<ISortFolderSpecifier | undefined>(undefined);

  useEffect((): (() => void) => {
    setLoading(true);
    const subscription = Meteor.subscribe('user.folders', { limit, sort }, () => {
      setLoading(false);
    });
    return (): void => {
      subscription.stop();
    };
  }, [sort]);

  const raiseLimit = (): void => {
    console.log('From UserFolderList, raiseLimit. folders.length:', folders.length, 'limit:', limit);
    if (folders.length === limit) {
      setLoading(true);
      const newLimit = limit + nbItemsPerPage;
      console.log('From UserFolderList, raiseLimit. limit:', limit, 'newLimit:', newLimit);
      setLimit(newLimit);
    }
  };

  const handleSort = (sortCriterion: ISortFolderCriterion) => (): void => {
    let sortValue: ISortSpecifierValue;
    if (sort && sort[sortCriterion]) {
      sortValue = sort[sortCriterion] === -1 ? undefined : -1;
    } else {
      sortValue = 1;
    }
    setSort({
      /* ...sort, // If a multicriteria sorting is needed. */
      [sortCriterion]: sortValue,
    } as unknown as ISortFolderSpecifier);
  };

  return (
    <FolderList
      displaySort={displaySort}
      emptyListPlaceholder={emptyListPlaceholder}
      handleSort={handleSort}
      handleToggleDisplaySort={handleToggleDisplaySort}
      loading={loading}
      logoMenuDeployed={logoMenuDeployed}
      raiseLimit={raiseLimit}
      folders={folders}
      handleSelectFolder={selectFolder}
      sort={sort}
    />
  );
};

const UserFolderList = withTracker<IUserFolderListWTData, IUserFolderListProps>(() => ({
  folders: Folders.find().fetch(),
}))(WrappedUserFolderList);

export default UserFolderList;

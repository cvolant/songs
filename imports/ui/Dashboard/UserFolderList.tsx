import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React, { ReactNode, useState, useEffect } from 'react';

import FolderList from '../FolderList/FolderList';

import { IFolder, IUser } from '../../types';
import {
  ISortCriterion,
  ISortSpecifier,
  ISortSpecifierValue,
} from '../../types/searchTypes';

import Folders from '../../api/folders/folders';

const nbItemsPerPage = 20;

interface IUserFolderListProps {
  displaySort?: boolean;
  emptyListPlaceholder: ReactNode;
  handleToggleDisplaySort: (display?: boolean) => () => void;
  logoMenuDeployed?: boolean;
}
interface IUserFolderListWTData {
  user: Meteor.User | null;
}
interface IWrappedUserFolderListProps
  extends IUserFolderListProps, IUserFolderListWTData { }

export const WrappedUserFolderList: React.FC<IWrappedUserFolderListProps> = ({
  displaySort = false,
  emptyListPlaceholder,
  handleToggleDisplaySort,
  logoMenuDeployed,
  user,
}) => {
  const [limit, setLimit] = useState(nbItemsPerPage);
  const [loading, setLoading] = useState(false);
  const [folders, setFolders] = useState<IFolder[]>([]);
  const [sort, setSort] = useState<ISortSpecifier | undefined>(undefined);
  const [subscriptions, setSubscriptions] = useState<Meteor.SubscriptionHandle[]>([]);

  const updateSubscription = (newSubscriptionOptions: {
    limit?: number;
    sort?: ISortSpecifier;
  } = {}): (() => void) => {
    setLoading(true);
    const newSubscriptions = subscriptions;
    console.log('From UserFolderList, updateSubscription. limit:', limit, 'user:', user || 'no-user', 'folders:', user ? (user as IUser).folders : 'no-user');
    const newSubscription = Meteor.subscribe('user.folders', newSubscriptionOptions, () => {
      const updatedFolders = Folders.find({
        _id: {
          $in: user ? ((user as IUser).folders || []) : [],
        },
      }, { sort: sort || { updatedAt: -1 } }).fetch() as IFolder[];
      setFolders(updatedFolders);
      console.log('From FolderList, updateSubscription, subscription callback. updatedFolders.length:', updatedFolders.length, 'Folders:', Folders);
      setLoading(false);
    });
    newSubscriptions.push(newSubscription);
    setSubscriptions(newSubscriptions);
    return (): void => {
      console.log('From UserFolderList, updateSubscription return. Stop subscriptions.');
      subscriptions.forEach((subscription) => subscription.stop());
      setFolders([]);
    };
  };

  useEffect(updateSubscription, [sort, user && ((user as IUser).folders || []).join()]);

  const raiseLimit = (): void => {
    console.log('From UserFolderList, raiseLimit. folders.length:', folders.length, 'limit:', limit);
    if (folders.length === limit) {
      setLoading(true);
      const newLimit = limit + nbItemsPerPage;
      console.log('From UserFolderList, raiseLimit. limit:', limit, 'newLimit:', newLimit);
      setLimit(newLimit);
      updateSubscription({ limit: newLimit });
    }
  };

  const handleSort = (sortCriterion: ISortCriterion) => (): void => {
    let sortValue: ISortSpecifierValue;
    if (sort && sort[sortCriterion]) {
      sortValue = sort[sortCriterion] === -1 ? undefined : -1;
    } else {
      sortValue = 1;
    }
    setSort({
      /* ...sort, // If a multicriteria sorting is needed. */
      [sortCriterion]: sortValue,
    } as unknown as ISortSpecifier);
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
      sort={sort}
    />
  );
};

const UserFolderList = withTracker<IUserFolderListWTData, IUserFolderListProps>(() => {
  const user = Meteor.user() as IUser;
  return { user };
})(WrappedUserFolderList);

export default UserFolderList;

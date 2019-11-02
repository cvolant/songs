import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React, { ReactNode, useState, useEffect } from 'react';

import FolderList from '../FolderList/FolderList';
import { IFolder, IUser } from '../../types';
import Folders from '../../api/folders/folders';

const nbItemsPerPage = 20;

interface IUserFolderListProps {
  emptyListPlaceholder: ReactNode;
  logoMenuDeployed?: boolean;
}
interface IUserFolderListWTData {
  user: Meteor.User | null;
}
interface IWrappedUserFolderListProps
  extends IUserFolderListProps, IUserFolderListWTData { }

export const WrappedUserFolderList: React.FC<IWrappedUserFolderListProps> = ({
  emptyListPlaceholder,
  logoMenuDeployed,
  user,
}) => {
  const [limit, setLimit] = useState(nbItemsPerPage);
  const [loading, setLoading] = useState(false);
  const [folders, setFolders] = useState<IFolder[]>([]);
  const [subscriptions, setSubscriptions] = useState<Meteor.SubscriptionHandle[]>([]);

  const updateSubscription = (newSubscriptionOptions: {
    limit?: number;
  } = {}): (() => void) => {
    setLoading(true);
    const newSubscriptions = subscriptions;
    console.log('From UserFolderList, updateSubscription. limit:', limit, 'user:', user || 'no-user', 'folders:', user ? (user as IUser).folders : 'no-user');
    const newSubscription = Meteor.subscribe('user.folders', newSubscriptionOptions, () => {
      const updatedFolders = Folders.find({
        _id: {
          $in: user ? ((user as IUser).folders || []) : [],
        },
      }, { sort: { updatedAt: -1 } }).fetch() as IFolder[];
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

  useEffect(updateSubscription, [user && ((user as IUser).folders || []).join()]);

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

  return (
    <>
      <FolderList
        emptyListPlaceholder={emptyListPlaceholder}
        loading={loading}
        logoMenuDeployed={logoMenuDeployed}
        raiseLimit={raiseLimit}
        smallDevice
        folders={folders}
      />
    </>
  );
};

const UserFolderList = withTracker<IUserFolderListWTData, IUserFolderListProps>(() => {
  Meteor.subscribe('user.folders');
  const user = Meteor.user() as IUser;
  return { user };
})(WrappedUserFolderList);

export default UserFolderList;

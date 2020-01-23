import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React, {
  createContext,
  useContext,
  useEffect,
  ReactElement,
} from 'react';
import { IUser } from '../../types';

const UserContext = createContext<IUser | null>(null);

const useUser = (): IUser | null => useContext(UserContext);

interface IUserProviderProps {
  children: ReactElement | ReactElement[];
}
interface IUserProviderWTData {
  user: Meteor.User | null;
}
interface IWrappedUserProviderProps
  extends IUserProviderProps, IUserProviderWTData { }

const WrappedUserProvider: React.FC<IWrappedUserProviderProps> = ({
  user,
  children,
}) => {
  useEffect(() => Meteor.subscribe('user').stop, []);

  return (
    <UserContext.Provider value={user as IUser}>
      {children}
    </UserContext.Provider>
  );
};

const UserProvider = withTracker<IUserProviderWTData, IUserProviderProps>(() => ({
  user: Meteor.user(),
}))(WrappedUserProvider);

export { UserProvider, useUser };

import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React, {
  createContext,
  useContext,
  useEffect,
  ReactElement,
} from 'react';
import { IUser } from '../../types';

type IUserContext = [
  IUser | null,
];

const UserContext = createContext<IUserContext | undefined>(undefined);

const useUser = (): IUserContext => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }

  return context;
};

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
  useEffect(() => {
    const subscription = Meteor.subscribe('user', () => {
      console.log('From app-user-context, useEffect[]. user:', user);
    });
    return subscription.stop;
  }, []);

  return (
    <UserContext.Provider value={[user as IUser]}>
      {children}
    </UserContext.Provider>
  );
};

const UserProvider = withTracker<IUserProviderWTData, IUserProviderProps>(() => ({
  user: Meteor.user(),
}))(WrappedUserProvider);

export { UserProvider, useUser };

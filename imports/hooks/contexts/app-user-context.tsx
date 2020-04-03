import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import React, { createContext, useContext, ReactElement } from 'react';
import { IUser } from '../../types';

const UserContext = createContext<IUser | null>(null);

const useUser = (): IUser | null => useContext(UserContext);

interface IUserProviderProps {
  children: ReactElement | ReactElement[];
}

const UserProvider: React.FC<IUserProviderProps> = ({ children }) => {
  useTracker(() => Meteor.subscribe('user'), []);
  const user = useTracker(() => Meteor.user());

  return (
    <UserContext.Provider value={user as IUser | null}>
      {children}
    </UserContext.Provider>
  );
};

export { UserProvider, useUser };

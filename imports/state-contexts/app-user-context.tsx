import React, {
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react';
import { IUser } from '../types';

type IUserContext = [
  IUser | undefined,
  React.Dispatch<React.SetStateAction<IUser | undefined>>,
];

const UserContext = createContext<IUserContext | undefined>(undefined);

const useUser = (): IUserContext => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('useUser must be used within a CountProvider');
  }

  return context;
};

interface IUserProviderProps {
  user?: IUser;
}

const UserProvider: React.FC<IUserProviderProps> = ({
  user: newUser,
  ...props
}) => {
  const [user, setUser] = useState<IUser | undefined>(newUser);
  const value = useMemo(() => [user, setUser], [user]) as IUserContext;

  // eslint-disable-next-line react/jsx-props-no-spreading
  return <UserContext.Provider value={value} {...props} />;
};

export { UserProvider, useUser };

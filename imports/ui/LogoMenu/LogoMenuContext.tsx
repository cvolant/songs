import { createContext, Dispatch, SetStateAction } from 'react';

export type ILogoMenuStateContext = [
  boolean,
  Dispatch<SetStateAction<boolean>>,
];

const LogoMenuContext = createContext<ILogoMenuStateContext | undefined>(undefined);

export default LogoMenuContext;

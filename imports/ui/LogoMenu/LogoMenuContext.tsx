import { createContext, Dispatch, SetStateAction } from 'react';

export type LogoMenuStateContext = [
  boolean,
  Dispatch<SetStateAction<boolean>> | undefined,
];

const LogoMenuContext = createContext<LogoMenuStateContext>([false, undefined]);

export default LogoMenuContext;

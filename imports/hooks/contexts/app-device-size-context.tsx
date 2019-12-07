import React, {
  createContext,
  useContext,
  ReactNode,
} from 'react';
import { useMediaQuery, useTheme } from '@material-ui/core';
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints';

type ISizeDirName = 'down' | 'only' | 'up';
interface ISizeDir {
  [key: string]: boolean;
  down: boolean;
  only: boolean;
  up: boolean;
}
interface IDeviceSize {
  [key: string]: ISizeDir;
  xs: ISizeDir;
  sm: ISizeDir;
  md: ISizeDir;
  lg: ISizeDir;
  xl: ISizeDir;
}
interface IDeviceSizeProviderProps {
  children?: ReactNode;
}

const DeviceSizeContext = createContext<IDeviceSize | undefined>(undefined);

const useDeviceSize = (sizeName: string): boolean | undefined => {
  const context = useContext(DeviceSizeContext);
  const [size, dir] = sizeName.split('.');

  if (!context) {
    throw new Error('useDeviceSize must be used within a DeviceSizeProvider');
  } else if (!context[size]) {
    return undefined;
  } else if (context[size][dir] === undefined) {
    return undefined;
  }
  return context[size][dir];
};

const DeviceSizeProvider: React.FC<IDeviceSizeProviderProps> = ({ children }) => {
  const theme = useTheme();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const value = {} as any;
  (['xs', 'sm', 'md', 'lg', 'xl'] as Breakpoint[]).forEach((size): void => {
    value[size] = {};
    (['down', 'only', 'up'] as ISizeDirName[]).forEach((dir) => {
      value[size][dir] = useMediaQuery(theme.breakpoints[dir](size));
    });
  });
  // eslint-disable-next-line react/jsx-props-no-spreading
  return (
    <DeviceSizeContext.Provider value={value as IDeviceSize | undefined}>
      {children}
    </DeviceSizeContext.Provider>
  );
};
export { DeviceSizeProvider, useDeviceSize };

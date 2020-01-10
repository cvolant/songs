import React, { ReactNode, SyntheticEvent } from 'react';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import { PaperProps as IPaperProps } from '@material-ui/core/Paper';

interface ITopMenuSmallProps {
  children: ReactNode;
  className?: string;
  handleToggleTopMenu: (deploy: boolean | undefined) => (event: SyntheticEvent<{}, Event>) => void;
  PaperProps?: Partial<IPaperProps>;
  topMenuIsOpen: boolean;
}

export const TopMenuSmall: React.FC<ITopMenuSmallProps> = ({
  children,
  className,
  handleToggleTopMenu,
  PaperProps,
  topMenuIsOpen,
}) => (
  <>
    <SwipeableDrawer
      anchor="top"
      className={className}
      open={topMenuIsOpen}
      onClose={handleToggleTopMenu(false)}
      onOpen={handleToggleTopMenu(true)}
      PaperProps={PaperProps}
    >
      {children}
    </SwipeableDrawer>
  </>
);

export default TopMenuSmall;

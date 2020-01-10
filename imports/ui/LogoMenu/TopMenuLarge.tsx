import React, { ReactNode } from 'react';
import { makeStyles } from '@material-ui/styles';
import Drawer from '@material-ui/core/Drawer';
import { PaperProps as IPaperProps } from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) => ({
  cushion: {
    transition: theme.transitions.create('margin-top', { duration: theme.transitions.duration.shorter }),
    marginTop: ((
      { topMenuIsOpen }: { topMenuIsOpen: boolean },
    ): string | number => (topMenuIsOpen ? theme.sizes.menuItem || '' : '')),
  },
}));

interface ITopMenuLargeProps {
  children: ReactNode;
  className?: string;
  PaperProps?: Partial<IPaperProps>;
  topMenuIsOpen: boolean;
}

export const TopMenuLarge: React.FC<ITopMenuLargeProps> = ({
  children,
  className,
  PaperProps,
  topMenuIsOpen,
}) => {
  const classes = useStyles({ topMenuIsOpen });

  return (
    <>
      <Drawer
        anchor="top"
        className={className}
        open={topMenuIsOpen}
        PaperProps={PaperProps}
        variant="persistent"
      >
        {children}
      </Drawer>
      <div className={classes.cushion} />
    </>
  );
};

export default TopMenuLarge;

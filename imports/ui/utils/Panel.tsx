import React, { ReactNode } from 'react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Clear from '@material-ui/icons/Clear';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    float: 'left',
    justifyContent: 'space-between',
    padding: theme.spacing(4),
    position: 'relative',

    '& > *': {
      zIndex: 0,
    },
  },
  close: {
    margin: theme.spacing(1),
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 2,
  },
}));

interface IPanel {
  children: ReactNode | ReactNode[];
  classes?: Record<string, string>;
  className?: string;
  closeName?: string;
  handleClosePanel: () => void;
}

export const Panel: React.FC<IPanel> = ({
  children,
  classes: propClasses,
  className,
  closeName,
  handleClosePanel,
}) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <Paper className={clsx(classes.root, className, propClasses && propClasses.root)}>
      <IconButton
        aria-label={closeName || t('Close')}
        className={clsx(classes.close, propClasses && propClasses.iconButton)}
        onClick={handleClosePanel}
      >
        <Clear className={propClasses && propClasses.icon} />
      </IconButton>
      {children}
    </Paper>
  );
};

export default Panel;

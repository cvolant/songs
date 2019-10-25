import React, { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { amber, green } from '@material-ui/core/colors';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import WarningIcon from '@material-ui/icons/Warning';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import clsx from 'clsx';

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
};

const useStyles = makeStyles((theme) => ({
  success: {
    backgroundColor: green[600],
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  info: {
    backgroundColor: theme.palette.secondary.main,
  },
  warning: {
    backgroundColor: amber[700],
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1),
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
}));

interface ISnackbarMessageProps {
  anchorOrigin?: {
    vertical: 'top' | 'bottom';
    horizontal: 'left' | 'center' | 'right';
  };
  autoHideDuration?: number;
  className?: string;
  key?: number | string;
  message?: string;
  variant: 'error' | 'info' | 'success' | 'warning';
}

export const SnackbarMessage: React.FC<ISnackbarMessageProps> = ({
  anchorOrigin = {
    vertical: 'bottom',
    horizontal: 'left',
  },
  autoHideDuration = 10000,
  className,
  key,
  message = '',
  variant,
}) => {
  const classes = useStyles();
  const [open, setOpen] = useState(true);
  const Icon = variantIcon[variant];

  const handleClose = (): void => {
    setOpen(false);
  };

  return (

    <Snackbar
      anchorOrigin={anchorOrigin}
      autoHideDuration={autoHideDuration}
      key={key}
      onClose={handleClose}
      open={!!message && open}
    >
      <SnackbarContent
        className={clsx(classes[variant], className)}
        aria-describedby="client-snackbar"
        message={(
          <span id="client-snackbar" className={classes.message}>
            <Icon className={clsx(classes.icon, classes.iconVariant)} />
            {message}
          </span>
        )}
        action={[
          <IconButton key="close" aria-label="close" color="inherit" onClick={handleClose}>
            <CloseIcon className={classes.icon} />
          </IconButton>,
        ]}
      />
    </Snackbar>
  );
};

export default SnackbarMessage;

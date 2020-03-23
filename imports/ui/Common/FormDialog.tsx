import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import React, {
  useState,
  FormEventHandler,
  ReactElement,
} from 'react';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import ArrowBackIos from '@material-ui/icons/ArrowBackIos';
import Check from '@material-ui/icons/Check';

import SnackbarMessage from './SnackBarMessage';

const useStyles = makeStyles((theme) => ({
  spacedIcon: {
    marginRight: '1rem',
  },
  circularProgress: {
    width: '1em !important',
    height: '1em !important',
    fontSize: theme.typography.h3.fontSize,
  },
}));

interface IFormDialogProps {
  children?: ReactElement | ReactElement[];
  dialogText?: string;
  dialogTitle: string;
  error?: string;
  handleClose: () => void;
  handleSubmit: (callback: (err: Meteor.Error | null, res?: Mongo.ObjectID) => void) => void;
  open?: boolean;
}

export const FormDialog: React.FC<IFormDialogProps> = ({
  dialogTitle,
  children,
  dialogText,
  error = '',
  handleClose,
  handleSubmit,
  open = false,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const onSubmit: FormEventHandler<HTMLFormElement> = (e): void => {
    e.preventDefault();
    if (!error) {
      // console.log('From FormDialog, onSubmit without error');
      handleSubmit((err: Meteor.Error | null) => {
        // console.log('From FormDialog, onSubmit callback.');
        if (err) {
          console.error('From FormDialog, handleCreateNew.callback. err:', err);
          setMessage(err.reason || 'Error, sorry... Cannot create a new one. Please retry!');
        } else {
          // console.log('From FormDialog, handleCreateNew.callback.');
          handleClose();
        }
      });
      setLoading(true);
    } else {
      setMessage(error);
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-name">
      <form onSubmit={onSubmit} noValidate>
        <DialogTitle id="form-dialog-name">
          {dialogTitle}
        </DialogTitle>
        <DialogContent>
          {dialogText && (
            <DialogContentText>
              {dialogText}
            </DialogContentText>
          )}
          {children}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined" color="primary">
            <ArrowBackIos />
            {t('Cancel')}
          </Button>
          <Button
            color="primary"
            disabled={loading || !!error}
            type="submit"
            variant="contained"
          >
            {loading
              ? <CircularProgress className={`${classes.spacedIcon} ${classes.circularProgress}`} />
              : <Check className={classes.spacedIcon} />}
            {t('Submit')}
          </Button>
        </DialogActions>
      </form>
      <SnackbarMessage message={message} variant="error" />
    </Dialog>
  );
};

export default FormDialog;

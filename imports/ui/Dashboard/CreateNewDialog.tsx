import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import React, { useState, ChangeEventHandler, FormEventHandler } from 'react';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Add from '@material-ui/icons/Add';
import ArrowBackIos from '@material-ui/icons/ArrowBackIos';
import Check from '@material-ui/icons/Check';
import { CircularProgress } from '@material-ui/core';

import SnackbarMessage from '../Utils/SnackBarMessage';

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

interface ICreateNewDialogProps {
  buttonText: string;
  dialogText: string;
  handleCreateNew: (
    name: string,
    callback: (err: Meteor.Error, res: Mongo.ObjectID) => void,
  ) => void;
  inputLabel: string;
}

export const CreateNewDialog: React.FC<ICreateNewDialogProps> = ({
  buttonText, dialogText, handleCreateNew, inputLabel,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setName('');
    setLoading(false);
    setOpen(false);
  };

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e): void => {
    const { target: { value } } = e;
    if (value.length > 100) {
      setError(t('dashbord.Max 100 characters', '100 characters maximum...'));
    } else {
      setName(value);
      setError('');
    }
  };

  const onSubmit: FormEventHandler<HTMLFormElement> = (e): void => {
    e.preventDefault();
    if (name) {
      handleCreateNew(name, (err: Meteor.Error) => {
        if (err) {
          console.error('From CreateNewDialog, handleCreateNew.callback. err:', err);
          setError(err.reason || 'Error, sorry... Cannot create a new one. Please retry!');
        } else {
          // console.log('From CreateNewDialog, handleCreateNew.callback. res:', res);
          handleClose();
        }
      });
      setLoading(true);
    }
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        <Add />
        {buttonText}
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-name">
        <form onSubmit={onSubmit} noValidate>
          <DialogTitle id="form-dialog-name">{buttonText}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {dialogText}
            </DialogContentText>
            <TextField
              autoFocus
              fullWidth
              id="name"
              label={inputLabel}
              margin="dense"
              onChange={handleChange}
              type="text"
              value={name}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} variant="outlined" color="primary">
              <ArrowBackIos />
              {t('Cancel')}
            </Button>
            <Button
              color="primary"
              disabled={loading || !name}
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
        <SnackbarMessage message={error} variant="error" />
      </Dialog>
    </div>
  );
};

export default CreateNewDialog;

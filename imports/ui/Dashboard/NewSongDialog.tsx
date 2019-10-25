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

import SnackbarMessage from '../utils/SnackBarMessage';
import { ISong } from '../../types';

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

interface INewSongDialogProps {
  setSelectedSong: (song: ISong) => void;
}

export const NewSongDialog: React.FC<INewSongDialogProps> = ({
  setSelectedSong,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setTitle('');
    setLoading(false);
    setOpen(false);
  };

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e): void => {
    const { target: { value } } = e;
    setTitle(value);
  };

  const handleNewSong = (songTitle: string): void => {
    Meteor.call('user.createdSongs.insert', { song: { title: songTitle } }, (err: Meteor.Error, res: Mongo.ObjectID) => {
      if (err) {
        console.error('From Dashboard, handleNewSong, user.createdSongs.insert callback. err:', err);
        setError(err.reason || 'Error, sorry... Cannot add song. Please retry!');
      } else {
        console.log('From Dashboard, handleNewSong, user.createdSongs.insert callback. res:', res);
        setSelectedSong({ _id: res, title: songTitle });
        handleClose();
      }
    });
  };

  const onSubmit: FormEventHandler<HTMLFormElement> = (e): void => {
    e.preventDefault();
    if (title) {
      handleNewSong(title);
      setLoading(true);
    }
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        <Add />
        {t('dashboard.New song', 'New song')}
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <form onSubmit={onSubmit} noValidate>
          <DialogTitle id="form-dialog-title">{t('dashboard.New song', 'New song')}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {t('dashboard.Enter title', 'Enter title')}
            </DialogContentText>
            <TextField
              autoFocus
              fullWidth
              id="name"
              label={t('song.Title', 'Title')}
              margin="dense"
              onChange={handleChange}
              type="text"
              value={title}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} variant="outlined" color="primary">
              <ArrowBackIos />
              {t('Cancel')}
            </Button>
            <Button
              color="primary"
              disabled={loading || !title}
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

export default NewSongDialog;

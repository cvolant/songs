import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import React, { useState, ChangeEventHandler } from 'react';
import { useTranslation } from 'react-i18next';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Add from '@material-ui/icons/Add';

import FormDialog from '../utils/FormDialog';
import { IUnfetchedSong } from '../../types/songTypes';

import { userInsertCreatedSong } from '../../api/users/methods';

interface ISongDialogProps {
  handleSelectSong: (song: IUnfetchedSong) => void;
}

export const SongDialog: React.FC<ISongDialogProps> = ({
  handleSelectSong,
}) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e): void => {
    const { target: { value } } = e;
    if (value.length > 100) {
      setError(t('dashbord.Max 100 characters', '100 characters maximum...'));
    } else {
      setTitle(value);
      setError('');
    }
  };

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
    setTitle('');
    setError('');
  };

  const handleNewSong = (callback: (err: Meteor.Error, res: Mongo.ObjectID) => void): void => {
    userInsertCreatedSong.call({ song: { title } }, (err: Meteor.Error, res: Mongo.ObjectID) => {
      callback(err, res);
      if (res) {
        handleSelectSong({ _id: res, title });
      }
    });
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        <Add />
        {t('dashboard.New song', 'New song')}
      </Button>
      <FormDialog
        dialogText={t('dashboard.Enter title', 'Enter title')}
        dialogTitle={t('dashboard.New song', 'New song')}
        error={error}
        handleClose={handleClose}
        handleSubmit={handleNewSong}
        open={open}
      >
        <TextField
          autoFocus
          fullWidth
          id="title"
          label={t('song.Title', 'Title')}
          margin="dense"
          onChange={handleChange}
          type="text"
          value={title}
        />
      </FormDialog>
    </div>
  );
};

export default SongDialog;

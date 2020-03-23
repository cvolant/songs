import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import React, { useState, ChangeEventHandler } from 'react';
import { useTranslation } from 'react-i18next';

import TextField from '@material-ui/core/TextField';

import FormDialog from '../Utils/FormDialog';
import { ISong, IUnfetched } from '../../types';

import { songsInsert } from '../../api/songs/methods';

interface ISongDialogProps {
  handleClose: () => void;
  handleSelectSong: (song: IUnfetched<ISong>) => void;
  open?: boolean;
  song?: ISong;
  title?: string;
}

export const SongDialog: React.FC<ISongDialogProps> = ({
  handleClose, handleSelectSong, open = false, title,
}) => {
  const { t } = useTranslation();

  const [songTitle, setSongTitle] = useState('');
  const [error, setError] = useState('');

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e): void => {
    const { target: { value } } = e;
    if (value.length > 100) {
      setError(t('dashbord.Max 100 characters', '100 characters maximum...'));
    } else {
      setSongTitle(value);
      setError('');
    }
  };

  const handleSubmit = (callback: (err: Meteor.Error, res: Mongo.ObjectID) => void): void => {
    songsInsert.call(
      { title: songTitle },
      (err: Meteor.Error, res: Mongo.ObjectID) => {
        callback(err, res);
        if (res) {
          handleSelectSong({ _id: res, title: songTitle });
        }
      },
    );
  };

  return (
    <FormDialog
      dialogText={t('dashboard.Enter title', 'Enter title')}
      dialogTitle={title || t('dashboard.New song', 'New song')}
      error={error}
      handleClose={handleClose}
      handleSubmit={handleSubmit}
      open={open}
    >
      <TextField
        autoFocus
        fullWidth
        id="songTitle"
        label={t('song.Title', 'Title')}
        margin="dense"
        onChange={handleChange}
        type="text"
        value={songTitle}
      />
    </FormDialog>
  );
};

export default SongDialog;

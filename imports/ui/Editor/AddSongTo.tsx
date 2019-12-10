import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import React, {
  useEffect, useState, ChangeEventHandler,
} from 'react';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ButtonBase from '@material-ui/core/ButtonBase';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Add from '@material-ui/icons/Add';
import Check from '@material-ui/icons/Check';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import Folder from '@material-ui/icons/Folder';

import { useUser } from '../../hooks/contexts/app-user-context';
import SnackbarMessage from '../utils/SnackBarMessage';
import { IFolder, ISong, IUnfetched } from '../../types';

import {
  userFavoriteToggle,
  userFoldersInsert,
} from '../../api/users/methods';
import {
  foldersUpdateSongsInsert,
  foldersUpdateSongsRemove,
} from '../../api/folders/methods';

const useStyles = makeStyles((theme) => ({
  buttonBase: {
    flexGrow: 1,
    padding: theme.spacing(1),
    textAlign: 'left',
  },
  flexGrow: {
    flexGrow: 1,
  },
  form: {
    display: 'flex',
    marginTop: theme.spacing(1),
    width: '100%', // Fix IE 11 issue.
  },
  fadded: {
    opacity: 0.6,
  },
  hoverable: {
    '&:hover': {
      background: theme.palette.darken.light,
    },
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  nameInput: {
    margin: theme.spacing(0, 1, 1, 0),
  },
  progress: {
    width: '1em !important',
    height: '1em !important',
    fontSize: theme.typography.h3.fontSize,
  },
}));

interface IAddSongToProps {
  folders: IFolder[];
  onClose: () => void;
  open?: boolean;
  song: IUnfetched<ISong>;
}

export const AddSongTo: React.FC<IAddSongToProps> = ({
  folders,
  onClose,
  open = false,
  song,
}) => {
  const user = useUser();
  const favorite = user && user.favoriteSongs && user.favoriteSongs
    .map((favoriteSong) => favoriteSong.toHexString())
    .includes(song._id.toHexString());

  const { t } = useTranslation();
  const classes = useStyles();

  const [error, setError] = useState('');
  const [localFavorite, setLocalFavorite] = useState(favorite);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [newFolder, setNewFolder] = useState(false);

  useEffect((): void => { setLocalFavorite(favorite); }, [favorite]);

  const handleClose = (): void => {
    setError('');
    onClose();
  };

  const handleFavoriteClick = (): void => {
    userFavoriteToggle.call({ songId: song._id, value: !localFavorite });
    setLocalFavorite(!localFavorite);
  };

  const handleListItemClick = (folderId: Mongo.ObjectID) => (): void => {
    setError('');
    foldersUpdateSongsInsert.call({ folderId, songId: song._id }, (err: Meteor.Error) => {
      if (err) {
        setError(err.reason || 'Error');
      }
    });
  };

  const handleRemove = (folderId: Mongo.ObjectID) => (): void => {
    setError('');
    foldersUpdateSongsRemove.call({ folderId, songId: song._id }, (err: Meteor.Error) => {
      if (err) {
        setError(err.reason || 'Error');
      }
    });
  };

  const handleNameChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    e.preventDefault();
    setName(e.target.value);
  };

  const handleNewFolder = (): void => {
    setError('');
    setNewFolder(true);
  };

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e): void => {
    e.preventDefault();
    console.log('From AddSongTo, onSubmit. e:', e);
    setError('');
    setLoading(true);
    userFoldersInsert.call({ name }, () => {
      setName('');
      setNewFolder(false);
      setLoading(false);
    });
  };

  return (
    <Dialog
      aria-labelledby={t('folder.Add song to', 'Add song to')}
      fullWidth
      maxWidth="xs"
      onClose={handleClose}
      open={open && !!user}
    >
      <DialogTitle disableTypography>
        <Typography variant="h4">
          {song.title || ''}
          <IconButton edge="end" color={favorite ? 'primary' : 'inherit'} onClick={handleFavoriteClick} aria-label="toggle-favorite">
            {localFavorite ? <Favorite /> : <FavoriteBorder />}
          </IconButton>
        </Typography>
      </DialogTitle>
      <DialogContent>
        <List>
          {folders.map((folder) => {
            const alreadyIn = folder.songs
              .map((songInFolder) => songInFolder._id.toHexString())
              .includes(song._id.toHexString());
            return (
              <ListItem className={classes.listItem} key={folder.name}>
                <ButtonBase
                  className={`${classes.buttonBase} ${alreadyIn ? '' : classes.hoverable}`}
                  disabled={alreadyIn}
                  onClick={handleListItemClick(folder._id)}
                >
                  <ListItemIcon>
                    <Folder />
                  </ListItemIcon>
                  <ListItemText className={alreadyIn ? classes.fadded : undefined}>
                    {`${folder.name} (${folder.songs && folder.songs.length} ${t('song.song', 'song')})`}
                  </ListItemText>
                </ButtonBase>
                {alreadyIn && (
                  <Button
                    color="primary"
                    onClick={handleRemove(folder._id)}
                    size="small"
                    variant="contained"
                  >
                    {t('Remove')}
                  </Button>
                )}
              </ListItem>
            );
          })}
          {newFolder
            ? (
              <ListItem>
                <ListItemIcon>
                  <Add />
                </ListItemIcon>
                <ListItemText disableTypography>
                  <form className={classes.form} onSubmit={onSubmit} noValidate>
                    <TextField
                      className={classes.nameInput}
                      fullWidth
                      inputProps={{ 'aria-label': t('folder.Folder name', 'Name') }}
                      name={t('folder.Folder name', 'Name')}
                      margin="normal"
                      onChange={handleNameChange}
                      placeholder={t('folder.Folder name', 'Name')}
                      value={name}
                    />
                    <Button disabled={loading} type="submit">
                      {loading ? <CircularProgress className={classes.progress} /> : <Check />}
                    </Button>
                  </form>
                </ListItemText>
              </ListItem>
            )
            : (
              <ListItem button onClick={handleNewFolder}>
                <ListItemIcon>
                  <Add />
                </ListItemIcon>
                <ListItemText primary={t('folder.Add folder', 'Add folder')} />
              </ListItem>
            )}
        </List>
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          onClick={handleClose}
          size="small"
        >
          {t('Close')}
        </Button>
      </DialogActions>
      {<SnackbarMessage message={error} variant="error" />}
    </Dialog>
  );
};

export default AddSongTo;

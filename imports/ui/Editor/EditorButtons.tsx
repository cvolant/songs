import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import IconButton from '@material-ui/core/IconButton';
import Add from '@material-ui/icons/Add';
import Delete from '@material-ui/icons/Delete';

import { useUser } from '../../hooks/contexts/app-user-context';
import AddSongTo from './AddSongTo';

import { IFolder, IUnfetched, IUser } from '../../types';
import { IParagraph, ISong } from '../../types/songTypes';
import { IIconButtonProps } from '../../types/iconButtonTypes';

const useStyles = makeStyles((theme) => ({
  bottomFab: {
    margin: theme.spacing(0.5),
  },
  bottomFabs: {
    '& div': {
      display: 'flex',
    },
    [theme.breakpoints.down('sm')]: {
      position: 'absolute',
      right: 0,
      top: 0,
      verticalAlign: 'bottom',
      width: '100%',

      '& > div': {
        position: 'absolute',
        bottom: theme.spacing(0.25),
        right: 0,
        flexWrap: 'wrap',
        justifyContent: 'flex-end',
      },
    },
  },
  button: {
    margin: theme.spacing(1),
    padding: theme.spacing(1, 1.5),
  },
  choiceFabs: {
    flexWrap: 'wrap-reverse',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  instructions: {
    flexGrow: 1,
    textAlign: 'center',
  },
}));

interface IEditorButtonsProps {
  actionIconButtonProps?: IIconButtonProps<IUnfetched<ISong>>;
  edit: boolean;
  folders: IFolder[];
  handleCancelAll: () => void;
  handleDelete: () => void;
  handleEditSong: () => void;
  handleSaveAll: () => void;
  handleToggleSelectAll: () => void;
  isThereParagraphs: boolean;
  isThereTitle: boolean;
  selectedPg: IParagraph[];
  song: IUnfetched<ISong>;
  user?: IUser;
}

const EditorButtons: React.FC<IEditorButtonsProps> = ({
  actionIconButtonProps,
  edit,
  folders,
  handleCancelAll,
  handleDelete,
  handleEditSong,
  handleSaveAll,
  handleToggleSelectAll,
  isThereParagraphs,
  isThereTitle,
  selectedPg,
  song,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const user = useUser();
  const [open, setOpen] = useState(false);

  const handleClickOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  return (
    <>
      {edit
        ? (
          <>
            <IconButton
              onClick={handleDelete}
            >
              <Delete />
            </IconButton>
            <div>
              <Button
                variant="outlined"
                className={classes.button}
                onClick={handleCancelAll}
              >
                {t('editor.Cancel all', 'Cancel all')}
              </Button>
              <Button
                disabled={!isThereTitle}
                className={classes.button}
                color="primary"
                onClick={handleSaveAll}
                variant="outlined"
              >
                {t('editor.Save all', 'Save all')}
              </Button>
            </div>
          </>
        )
        : (
          <>
            <div className={classes.bottomFabs}>
              <div>
                {user && user._id && (
                  <Fab
                    aria-label={t('Add')}
                    className={classes.bottomFab}
                    onClick={handleClickOpen}
                  >
                    <Add />
                  </Fab>
                )}
              </div>
            </div>
            <AddSongTo
              folders={folders}
              open={open}
              onClose={handleClose}
              song={song}
            />
          </>
        )}
    </>
  );
};

export default EditorButtons;

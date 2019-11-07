import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CardActions from '@material-ui/core/CardActions';
import Fab from '@material-ui/core/Fab';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ArrowBackIos from '@material-ui/icons/ArrowBackIos';
import Add from '@material-ui/icons/Add';
import Edit from '@material-ui/icons/Edit';
import Delete from '@material-ui/icons/Delete';

import { useUser } from '../../state-contexts/app-user-context';
import AddSongTo from './AddSongTo';

import { IFolder, IUser } from '../../types';
import { IUnfetchedSong, IParagraph } from '../../types/songTypes';
import { IIconButtonProps } from '../../types/otherTypes';

const useStyles = makeStyles((theme) => ({
  actions: {
    justifyContent: 'space-between',
    position: 'relative',
  },
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
  circularProgress: {
    width: '6rem',
    height: '6rem',
    position: 'relative',
    top: 'calc(50% - 6rem)',
    left: 'calc(50% - 6rem)',
  },
  instructions: {
    flexGrow: 1,
    textAlign: 'center',
  },
  shadowTop: {
    position: 'absolute',
    height: 0,
    width: '100%',
    top: 0,
    left: 0,

    '& > div': {
      position: 'absolute',
      bottom: 0,
      height: theme.spacing(0.5),
      background: `linear-gradient(to top, ${theme.palette.grey['500']}, transparent)`,
      width: '100%',
      borderRadius: theme.spacing(0, 0, 0.5, 0.5),
    },
  },
}));

interface IEditorButtonsProps {
  actionIconButtonProps?: IIconButtonProps;
  edit: boolean;
  folders: IFolder[];
  goBack: () => void;
  handleCancelAll: () => void;
  handleDelete: () => void;
  handleEditSong: () => void;
  handleSaveAll: () => void;
  handleToggleSelectAll: () => void;
  isThereParagraphs: boolean;
  isThereTitle: boolean;
  selectedPg: IParagraph[];
  song: IUnfetchedSong;
  user?: IUser;
}

const EditorButtons: React.FC<IEditorButtonsProps> = ({
  actionIconButtonProps,
  edit,
  folders,
  goBack,
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
  console.log('From EditorButtons. useUser():', useUser());
  const [user] = useUser();
  const [open, setOpen] = useState(false);


  const handleClickOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  return (
    <CardActions className={classes.actions}>
      <div className={classes.shadowTop}><div /></div>
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
            <Button
              color="primary"
              onClick={goBack}
              size="large"
              variant="outlined"
            >
              <ArrowBackIos />
              {t('editor.Return', 'Return')}
            </Button>
            <Typography variant="body1" className={classes.instructions}>
              {isThereParagraphs
                ? t('editor.Select paragraphs', 'Select paragraphs')
                : ''}
            </Typography>
            <div className={classes.bottomFabs}>
              <div>
                {user && user._id && user._id === song.userId && (
                  <Fab
                    aria-label={t('editor.Edit', 'Edit')}
                    className={classes.bottomFab}
                    onClick={handleEditSong}
                  >
                    <Edit />
                  </Fab>
                )}
                {user && user._id && (
                  <Fab
                    aria-label={t('Add')}
                    className={classes.bottomFab}
                    onClick={handleClickOpen}
                  >
                    <Add />
                  </Fab>
                )}
                <div className={classes.choiceFabs}>
                  <Fab
                    aria-label={t('editor.Select or unselect all', 'Select or unselect all')}
                    disabled={!isThereParagraphs}
                    className={classes.bottomFab}
                    onClick={handleToggleSelectAll}
                    variant="extended"
                  >
                    {selectedPg.length
                      ? t('editor.Unselect all', 'Unselect all')
                      : t('editor.Select all', 'Select all')}
                  </Fab>
                  {actionIconButtonProps && (({
                    ariaLabel, className, color, disable, Icon, onClick,
                  }): JSX.Element => (
                    <Fab
                      aria-label={ariaLabel}
                      className={className}
                      color={color || 'default'}
                      disabled={disable
                        ? disable(!!selectedPg.length)
                        : false}
                      onClick={onClick({
                        ...song,
                        pg: selectedPg,
                      })}
                    >
                      <Icon />
                    </Fab>
                  ))(actionIconButtonProps)}
                </div>
              </div>
            </div>
            <AddSongTo
              folders={folders}
              open={open}
              onClose={handleClose}
              song={song}
              user={user}
            />
          </>
        )}
    </CardActions>
  );
};

export default EditorButtons;

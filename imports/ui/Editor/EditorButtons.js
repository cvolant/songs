import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CardActions from '@material-ui/core/CardActions';
import Fab from '@material-ui/core/Fab';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ArrowBackIos from '@material-ui/icons/ArrowBackIos';
import Check from '@material-ui/icons/Check';
import Edit from '@material-ui/icons/Edit';
import Delete from '@material-ui/icons/Delete';

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


const EditorButtons = ({
  edit,
  goBack,
  handleCancelAll,
  handleDelete,
  handleOpenScreen,
  handleSaveAll,
  handleToggleSelectAll,
  isAuthenticated,
  isThereParagraphs,
  isThereSelected,
  setEdit,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();

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
                variant="outlined"
                className={classes.button}
                color="primary"
                onClick={handleSaveAll}
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
                {isAuthenticated && (
                  <Fab
                    aria-label={t('editor.Edit', 'Edit')}
                    className={classes.bottomFab}
                    onClick={() => setEdit(true)}
                  >
                    <Edit />
                  </Fab>
                )}
                <div className={classes.choiceFabs}>
                  <Fab
                    aria-label={('editor.Select or unselect all', 'Select or unselect all')}
                    disabled={!isThereParagraphs}
                    className={classes.bottomFab}
                    onClick={handleToggleSelectAll}
                    variant="extended"
                  >
                    {isThereSelected
                      ? t('editor.Unselect all', 'Unselect all')
                      : t('editor.Select all', 'Select all')}
                  </Fab>
                  <Fab
                    aria-label={('editor.Validate', 'Validate')}
                    className={classes.bottomFab}
                    color="primary"
                    disabled={!isThereSelected}
                    onClick={handleOpenScreen}
                  >
                    <Check />
                  </Fab>
                </div>
              </div>
            </div>
          </>
        )}
    </CardActions>
  );
};

EditorButtons.propTypes = {
  edit: PropTypes.bool.isRequired,
  goBack: PropTypes.func.isRequired,
  handleCancelAll: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleOpenScreen: PropTypes.func.isRequired,
  handleSaveAll: PropTypes.func.isRequired,
  handleToggleSelectAll: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  isThereParagraphs: PropTypes.bool.isRequired,
  isThereSelected: PropTypes.bool.isRequired,
  setEdit: PropTypes.func.isRequired,
};

export default EditorButtons;

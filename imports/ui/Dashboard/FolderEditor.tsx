import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Add from '@material-ui/icons/Add';
import ArrowBackIos from '@material-ui/icons/ArrowBackIos';
import Settings from '@material-ui/icons/Settings';
import Sort from '@material-ui/icons/Sort';

import UserSongList from './UserSongList';

import { IUnfetchedFolder } from '../../types/folderTypes';
import { IUnfetchedSong } from '../../types/songTypes';

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
    padding: theme.spacing(1, 1.5),
  },
  card: {
    position: 'relative',
    width: '100%',
  },
  cardAction: {
    bottom: 0,
    display: 'flex',
    justifyContent: 'space-between',
    position: 'absolute',
    width: '100%',
  },
  cardContent: {
    paddingTop: 0,
  },
  cardHeader: {
    paddingBottom: 0,
    paddingRight: (
      { logoMenuDeployed }: { logoMenuDeployed: boolean },
    ): number | string => theme.spacing(logoMenuDeployed ? 16 : 10),
    transition: theme.transitions.create('padding-right'),
  },
}));

interface IFolderEditorProps {
  folder: IUnfetchedFolder;
  goBack: () => void;
  logoMenuDeployed: boolean;
  handleAddSong: () => void;
  handleSelectSong: (song: IUnfetchedSong) => void;
}

export const FolderEditor: React.FC<IFolderEditorProps> = ({
  folder, goBack, logoMenuDeployed, handleAddSong, handleSelectSong,
}) => {
  const { t } = useTranslation();
  const classes = useStyles({ logoMenuDeployed });

  const [displaySort, setDisplaySort] = useState(false);

  const handleToggleDisplaySort = (newDisplaySort?: boolean) => (): void => {
    setDisplaySort(newDisplaySort === undefined ? !displaySort : newDisplaySort);
  };

  const handleEditSettings = (): void => {};

  return (
    <Card className={classes.card}>
      <CardHeader
        action={(
          <div>
            <IconButton
              aria-label={t('search.Sort', 'Sort')}
              onClick={handleToggleDisplaySort()}
              size="small"
            >
              <Sort />
            </IconButton>
          </div>
        )}
        className={classes.cardHeader}
        disableTypography
        title={(
          <Typography variant="h4">
            {folder.name}
          </Typography>
        )}
      />
      <CardContent className={classes.cardContent}>
        <UserSongList
          displaySort={displaySort}
          emptyListPlaceholder={(
            <Typography>
              {t('folder.No songs found in this folder', 'No songs found in this folder...')}
            </Typography>
          )}
          folder={folder}
          handleToggleDisplaySort={handleToggleDisplaySort}
          logoMenuDeployed={logoMenuDeployed}
          handleSelectSong={handleSelectSong}
          userSongList="folderSongs"
        />
      </CardContent>
      <CardActions className={classes.cardAction}>
        <Button
          className={classes.button}
          color="primary"
          onClick={goBack}
          size="large"
          variant="outlined"
        >
          <ArrowBackIos />
          {t('editor.Return', 'Return')}
        </Button>
        <div>
          <Button
            className={classes.button}
            color="primary"
            onClick={handleAddSong}
            size="large"
            variant="contained"
          >
            <Add />
            {t('folder.Add song', 'Add song')}
          </Button>
          <Button
            className={classes.button}
            color="primary"
            onClick={handleEditSettings}
            size="large"
            variant="outlined"
          >
            <Settings />
            {t('folder.Settings', 'Settings')}
          </Button>
        </div>
      </CardActions>
    </Card>
  );
};

export default FolderEditor;

/* global alert */
import React from 'react';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Check from '@material-ui/icons/Check';
import Folder from '@material-ui/icons/Folder';
import Settings from '@material-ui/icons/Settings';

import { useDeviceSize } from '../../state-contexts/app-device-size-context';
import FolderListItemText from './FolderListItemText';
import { IFolder } from '../../types';

const useStyles = makeStyles((theme) => ({
  listIcon: {
    justifyContent: 'center',
  },
  root: {
    paddingLeft: 0,
    paddingRight: theme.spacing(11),
  },
  secondaryAction: {
    right: 0,
  },
}));

interface IFolderListItemProps {
  handleSelect: () => void;
  handleUnfold: () => void;
  folder: IFolder;
  unfolded: boolean;
}

export const FolderListItem: React.FC<IFolderListItemProps> = ({
  handleSelect,
  handleUnfold,
  folder,
  unfolded,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const smallDevice = useDeviceSize('sm.down');

  return (
    <ListItem
      button={!unfolded}
      className={classes.root}
      divider
      onClick={handleUnfold}
    >
      {!smallDevice && (
        <ListItemIcon className={classes.listIcon}>
          <Folder />
        </ListItemIcon>
      )}
      <FolderListItemText
        folder={folder}
        unfolded={unfolded}
      />
      <ListItemSecondaryAction className={classes.secondaryAction}>
        <IconButton
          aria-label={t('folder.Folder settings', 'Folder settings')}
          // eslint-disable-next-line no-alert
          onClick={(): void => alert('Still undefined')}
        >
          <Settings />
        </IconButton>
        <IconButton aria-label={t('folder.Choose this folder', 'Choose this folder')} onClick={handleSelect}>
          <Check />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default FolderListItem;

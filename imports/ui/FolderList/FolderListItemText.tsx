import React from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';

import { makeStyles } from '@material-ui/core/styles';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

import { useDeviceSize } from '../../state-contexts/app-device-size-context';
import Songs from '../../api/songs/songs';

import { IFolder } from '../../types';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    marginRight: theme.spacing(2),
    whiteSpace: 'nowrap',
  },
  folded: {
    color: theme.palette.font.color.black,
    opacity: theme.palette.font.opacity.light,
    marginRight: theme.spacing(2),
    whiteSpace: 'nowrap',
    '& > *': {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
  },
  titles: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    flexGrow: 1,
  },
  unfolded: {
    marginRight: theme.spacing(2),
  },
  date: {
    flexShrink: 0,
    marginLeft: theme.spacing(2),
  },
}));

interface IFolderListItemTextProps {
  folder: IFolder;
  unfolded: boolean;
}

export const FolderListItemText: React.FC<IFolderListItemTextProps> = ({
  folder, unfolded,
}) => {
  const { t, i18n } = useTranslation();
  const classes = useStyles();
  const smallDevice = useDeviceSize('sm.down');

  const { date, name, songs } = folder;

  console.log('From FolderListItem, render. folder:', folder, 'songs:', songs, 'songs.map((song) => song._id):', songs.map((song) => song._id));

  return (
    <ListItemText
      disableTypography
      primary={(
        <div className={classes.container}>
          <Typography className={classes.titles} variant="h6">
            {name || <em>{t('folder.Untitled folder', 'Untitled folder')}</em>}
          </Typography>
          {date && <Typography className={classes.date} variant="h6">{moment(date).locale(i18n.language).calendar().replace(new RegExp(` ${t("date 'at'", 'at')} .+`), '')}</Typography>}
        </div>
      )}
      secondary={(
        <div className={unfolded ? classes.unfolded : classes.folded}>
          {(!smallDevice || unfolded) && (
            <Typography>
              {Songs.find({ _id: { $in: songs.map((song) => song._id) } }).map((song) => song.title).join(', ')}
            </Typography>
          )}
        </div>
      )}
    />
  );
};

export default FolderListItemText;

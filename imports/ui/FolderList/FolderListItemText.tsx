import React from 'react';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

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
  smallDevice: boolean;
  folder: IFolder;
  unfolded: boolean;
}

export const FolderListItemText: React.FC<IFolderListItemTextProps> = ({
  smallDevice, folder, unfolded,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const { date, name, userId } = folder;

  console.log('From FolderListItemText. Songs:', Songs);

  return (
    <ListItemText
      disableTypography
      primary={(
        <div className={classes.container}>
          <Typography className={classes.titles} variant="h6">
            {name || <em>{t('folder.Untitled folder', 'Untitled folder')}</em>}
          </Typography>
          {date && <Typography className={classes.date} variant="h6">{date.toDateString()}</Typography>}
        </div>
      )}
      secondary={(
        <div className={unfolded ? classes.unfolded : classes.folded}>
          {(!smallDevice || unfolded) && (
            <Typography>
              {Songs.find({ userId }).map((song) => song.title).join(', ')}
            </Typography>
          )}
        </div>
      )}
    />
  );
};

export default FolderListItemText;

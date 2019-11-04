import React from 'react';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import MusicNote from '@material-ui/icons/MusicNote';
import TextFields from '@material-ui/icons/TextFields';
import Translate from '@material-ui/icons/Translate';

import { useDeviceSize } from '../../state-contexts/app-device-size-context';
import InlineIcon from '../utils/InlineIcon';
import { ISong } from '../../types';

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
  year: {
    flexShrink: 0,
    marginLeft: theme.spacing(2),
  },
}));

interface ISongListItemTextProps {
  song: ISong;
  unfolded: boolean;
}

export const SongListItemText: React.FC<ISongListItemTextProps> = ({
  song, unfolded,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const smallDevice = useDeviceSize('sm.down');

  const {
    title,
    subtitle,
    year,
    author,
    compositor,
    pg,
    traductor,
  } = song;
  const details = [];
  const lyrics = pg && pg[0] && pg[0].pg ? pg[0].pg.replace(/<br\/>/g, ' ') : '';

  if (compositor) {
    details.push({
      key: `${t('song.Music', 'Music')}${t('colon', ':')} `,
      before: null,
      icon: MusicNote,
      name: compositor,
      after: null,
    });
  }
  if (author) {
    details.push({
      key: `${t('song.Text', 'Text')}${t('colon', ':')} `,
      before: details.length && ' · ',
      icon: TextFields,
      name: author,
      after: null,
    });
  }
  if (traductor) {
    details.push({
      key: `${t('song.Translation', 'Translation')}${t('colon', ':')} `,
      before: details.length && ' · ',
      icon: Translate,
      name: traductor,
      after: null,
    });
  }
  /* if (editeur) details.push({
      key: `${t('song.Edition', 'Edition')}${'colon', ':'} `, */
  // eslint-disable-next-line no-irregular-whitespace
  /*    before: details.length && ' (',
      name: editeur,
      icon: null,
      after: details.length && ')',
  }); */

  return (
    <ListItemText
      disableTypography
      primary={(
        <div className={classes.container}>
          <Typography className={classes.titles} variant="h6">
            {title || <em>{t('song.Untitled song', 'Untitled song')}</em>}
            {subtitle && !smallDevice && (
              <em>
                {' '}
                &mdash;
                {' '}
                {subtitle}
              </em>
            )}
          </Typography>
          {year && <Typography className={classes.year} variant="h6">{year}</Typography>}
        </div>
      )}
      secondary={(
        <div className={unfolded ? classes.unfolded : classes.folded}>
          {(!smallDevice || unfolded) && (
            <Typography>
              {details.map((detail) => (
                <span key={detail.key}>
                  {detail.before}
                  {detail.icon && <InlineIcon Icon={detail.icon} />}
                  {!smallDevice && unfolded && detail.key}
                  {detail.name}
                  {detail.after}
                </span>
              ))}
              {!smallDevice && !unfolded && (
                <span>
                  —
                  {lyrics}
                </span>
              )}
            </Typography>
          )}
          {(smallDevice || unfolded) && <Typography>{lyrics}</Typography>}
        </div>
      )}
    />
  );
};

export default SongListItemText;

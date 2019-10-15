import React from 'react';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import MusicNote from '@material-ui/icons/MusicNote';
import TextFields from '@material-ui/icons/TextFields';
import Translate from '@material-ui/icons/Translate';

import InlineIcon from '../utils/InlineIcon';
import { ISong } from '../../api/songs';

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
  smallDevice: boolean;
  song: ISong;
  unfolded: boolean;
}

export const SongListItemText: React.FC<ISongListItemTextProps> = ({
  smallDevice, song, unfolded,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const {
    titre,
    sousTitre,
    annee,
    auteur,
    compositeur,
    pg,
    traducteur,
  } = song;
  const details = [];
  const lyrics = pg && pg[0] && pg[0].pg ? pg[0].pg.replace(/<br\/>/g, ' ') : '';

  if (compositeur) {
    details.push({
      key: `${t('song.Music', 'Music')}${t('colon', ':')} `,
      before: null,
      icon: MusicNote,
      name: compositeur,
      after: null,
    });
  }
  if (auteur) {
    details.push({
      key: `${t('song.Text', 'Text')}${t('colon', ':')} `,
      before: details.length && ' · ',
      icon: TextFields,
      name: auteur,
      after: null,
    });
  }
  if (traducteur) {
    details.push({
      key: `${t('song.Translation', 'Translation')}${t('colon', ':')} `,
      before: details.length && ' · ',
      icon: Translate,
      name: traducteur,
      after: null,
    });
  }
  /* if (editeur) details.push({
      key: `${t('song.Edition', 'Edition')}${'colon', ':'} `,
      before: details.length && ' (',
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
            {titre || <em>{t('song.Untitled song', 'Untitled song')}</em>}
            {sousTitre && !smallDevice && (
              <em>
                {' '}
                &mdash;
                {' '}
                {sousTitre}
              </em>
            )}
          </Typography>
          {annee && <Typography className={classes.year} variant="h6">{annee}</Typography>}
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

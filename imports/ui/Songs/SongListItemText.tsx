import React, { Fragment, MouseEventHandler } from 'react';
import { useTranslation } from 'react-i18next';

import Typography from '@material-ui/core/Typography';
import MusicNote from '@material-ui/icons/MusicNote';
import TextFields from '@material-ui/icons/TextFields';
import Translate from '@material-ui/icons/Translate';

import { useDeviceSize } from '../../hooks/contexts/app-device-size-context';
import ListLayoutItemText from '../ListLayout/ListLayoutItemText';
import InlineIcon from '../utils/InlineIcon';

import { ISong } from '../../types';

interface ISongListItemTextProps {
  handleUnfold: MouseEventHandler<HTMLDivElement>;
  song: ISong;
  unfolded: boolean;
}

export const SongListItemText: React.FC<ISongListItemTextProps> = ({
  song, handleUnfold, unfolded,
}) => {
  const { t } = useTranslation();
  const smallDevice = useDeviceSize('sm.down');

  const {
    title,
    subtitle,
    year,
    author,
    compositor,
    lyrics,
    traductor,
  } = song;
  const details = [];
  const excerpt = lyrics && lyrics[0] && lyrics[0].pg
    ? lyrics[0].pg
      .replace(/(<br\/>|\s)+/g, ' ')
      .substr(0, 130)
      .replace(/\s\S*$/g, ' ...')
    : '';

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
    <ListLayoutItemText
      handleUnfold={handleUnfold}
      primary={[
        <Fragment key="title">{title}</Fragment>
        || <em key="title">{t('song.Untitled song', 'Untitled song')}</em>,
        subtitle && !smallDevice
          ? (
            <em key="subtitle">
              {' '}
              &mdash;
              {' '}
              {subtitle}
            </em>
          ) : null,
      ]}
      rightSide={year}
      secondary={[
        (!smallDevice || unfolded) && (
          <Typography key="details">
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
              <span key="excerpt">
                {' — '}
                {excerpt}
              </span>
            )}
          </Typography>
        ),
        (smallDevice || unfolded) && <Typography key="excerpt">{excerpt}</Typography>,
      ]}
      unfolded={unfolded}
    />
  );
};

export default SongListItemText;

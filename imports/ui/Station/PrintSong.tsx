import React from 'react';

import { makeStyles } from '@material-ui/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { IParagraph } from '../types';

const modifyFontSize = (fontSize: string, zoom: number): string => parseFloat(fontSize) * zoom + fontSize.substring((`${parseFloat(fontSize)}`).length);

const useStyles = makeStyles((theme) => ({
  title: ({ zoom }: { zoom: number }): { fontSize: string } => ({
    fontSize: modifyFontSize(theme.typography.h1.fontSize.toString(), zoom),
  }),
  subtitle: ({ zoom }: { zoom: number }): {
    fontSize: string;
    clear: 'left' | 'right' | '-moz-initial' | 'inherit' | 'initial' | 'revert' | 'unset' | 'both' | 'none' | 'inline-end' | 'inline-start';
  } => ({
    fontSize: modifyFontSize(theme.typography.subtitle1.fontSize.toString(), 2 * zoom) as string,
    clear: 'both',
  }),
  paragraph: ({ zoom }: { zoom: number }): { fontSize: string } => ({
    fontSize: modifyFontSize(theme.typography.body1.fontSize.toString(), 2 * zoom) as string,
  }),
  return: {
    margin: '0 !important',
    padding: '0 !important',
    clear: 'both',
  },
}));
interface IPrintSongProps {
  song: {
    title?: string;
    subtitle?: string;
    lyrics?: IParagraph[];
  };
  zoom?: number;
}

export const PrintSong: React.FC<IPrintSongProps> = ({
  song, zoom = 0.5,
}) => {
  const classes = useStyles({ zoom });

  console.log('From PrintSong. song:', song);

  return (
    <Grid container spacing={4}>
      {song.lyrics && song.lyrics.map((paragraph, index) => {
        // eslint-disable-next-line react/no-array-index-key
        const pgText = paragraph.pg.split(/(<br\/>\n)/g).map((e, ind) => (e === '<br/>\n' ? <br key={ind} /> : e));
        return (
          <Grid key={paragraph.index || index} item xs={12} sm={6} md={4} xl={3}>
            <Typography className={classes.paragraph} variant="body1">
              {pgText}
            </Typography>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default PrintSong;

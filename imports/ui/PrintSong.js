import React, { useState } from "react";
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';

import { makeStyles } from '@material-ui/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

const modifyFontSize = (fontSize, zoom) => parseFloat(fontSize) * zoom + fontSize.substring(('' + parseFloat(fontSize)).length);

const useStyles = makeStyles(theme => ({
  title: ({ zoom }) => ({
    fontSize: modifyFontSize(theme.typography.h1.fontSize, zoom),
  }),
  subtitle: ({ zoom }) => ({
    fontSize: modifyFontSize(theme.typography.subtitle1.fontSize, 2 * zoom),
    clear: 'both',
  }),
  paragraph: ({ zoom }) => ({
    fontSize: modifyFontSize(theme.typography.body1.fontSize, 2 * zoom),
  }),
  return: {
    margin: '0 !important',
    padding: '0 !important',
    clear: 'both',
  }
}));

export const PrintSong = props => {
  const { song, zoom } = props;
  const classes = useStyles({ zoom });
  const [currentPage, setCurrentPage] = useState(1);

  console.log('From PrintSong. song:', song);

  return (
    <Grid container spacing={8}>
      <Grid item xs={12}>
        <Typography className={classes.title} variant='h1'>{song.title}</Typography>
        <Typography className={classes.subtitle} variant='subtitle1'>{song.subtitle}</Typography>
      </Grid>
      <div className={classes.return} />
      {song.pg.map((paragraph, index) => {
        const pgText = paragraph.pg.split(/(<br\/>\n)/g).map((e, index) => e == '<br/>\n' ? <br key={index} /> : e);
        return (
          <Grid item xs={12} sm={6} md={4} xl={3}>
            <Typography key={index} className={classes.paragraph} variant='body1'>
              {pgText}
            </Typography>
          </Grid>
        );
      })}
    </Grid>
  );
};

PrintSong.propTypes = {
  song: PropTypes.object,
};

export default withTracker(props => {
  return {
    searchFocus: Session.get('searchFocus')
  };
})(PrintSong);
import React, { useState } from "react";
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { makeStyles } from '@material-ui/styles';
import { Typography } from "@material-ui/core";

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
    <React.Fragment>
      <Typography className={classes.title} variant='h1'>{song.title}</Typography>
      <Typography className={classes.subtitle} variant='subtitle1'>Zoom: {zoom}</Typography>
      <div className={classes.return} />
      {song.pg.map((paragraph, index) => (
        <Typography key={index} className={classes.paragraph} variant='body1'>
          {paragraph.pg}
        </Typography>
      ))}
    </React.Fragment>
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
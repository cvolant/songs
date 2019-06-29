import React from 'react';
import { PropTypes } from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    container: {
        display: 'flex',
        justifyContent: 'space-between',
        marginRight: theme.spacing(2),
        whiteSpace: 'nowrap',
    },
    titles: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        flexGrow: 1,
    },
    year: {
        flexShrink: 0,
        marginLeft: theme.spacing(2),
    },
}));

export const SongListItemTextPrimary = ({ smallDevice, song, unfolded }) => {
    const classes = useStyles();

    let { titre, sousTitre, annee } = song;
    return (
        <div className={classes.container}>
            <Typography className={classes.titles} variant='h6'>{titre || <em>Untitled song</em> + sousTitre && !smallDevice && <em> &mdash; {sousTitre}</em>}</Typography>
            {annee && <Typography className={classes.year} variant='h6'>{annee}</Typography>}
        </div>
    );
};

SongListItemTextPrimary.propTypes = {
    smallDevice: PropTypes.bool.isRequired,
    song: PropTypes.object.isRequired,
    unfolded: PropTypes.bool.isRequired,
};

export default SongListItemTextPrimary;
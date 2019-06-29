import React from 'react';
import { PropTypes } from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    folded: {
        color: theme.palette.grey['600'],
        marginRight: theme.spacing(2),
        whiteSpace: 'nowrap',
        '& > *': {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
        },
    },
    unfolded: {
        marginRight: theme.spacing(2),
    }
}));

export const SongListItemTextSecondary = ({ smallDevice, song, unfolded }) => {
    const classes = useStyles();

    let { auteur, compositeur, editeur, pg } = song;
    let details = '';
    const lyrics = pg && pg[0] && pg[0].pg ? pg[0].pg.replace(/<br\/>/g, ' ') : '';
    const jsxElements = [];

    if (unfolded && !smallDevice) {
        auteur = auteur ? 'Author: ' + auteur : '';
        compositeur = compositeur ? 'Compositor: ' + compositeur : '';
        editeur = editeur ? 'Editor: ' + editeur : '';
    }
    if (auteur) details += auteur;
    if (compositeur && compositeur != auteur) details += !!details && ' · ' + compositeur;
    if (editeur) details += details ? (unfolded ? ` · ${editeur}` : ` (${editeur})`) : editeur;

    if (smallDevice) {
        if (unfolded) jsxElements.push(<Typography key={0}>{details}</Typography>);
        jsxElements.push(<Typography key={1}>{lyrics}</Typography>);
    } else {
        jsxElements.push(<Typography key={0}>{details + (unfolded ? '' : (!!details && ' — ' + lyrics))}</Typography>);
        if (unfolded) jsxElements.push(<Typography key={1}>{lyrics}</Typography>)
    }

    return (
        <div className={unfolded ? classes.unfolded : classes.folded}>
            {jsxElements}
        </div>
    );
};

SongListItemTextSecondary.propTypes = {
    smallDevice: PropTypes.bool.isRequired,
    song: PropTypes.object.isRequired,
    unfolded: PropTypes.bool.isRequired,
};

export default SongListItemTextSecondary;
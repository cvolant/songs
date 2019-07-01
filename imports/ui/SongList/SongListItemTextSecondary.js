import React from 'react';
import { PropTypes } from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { MusicNote, Publish, TextFields, Translate } from '@material-ui/icons';

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
    inlineIcons: {
        height: '0.8em',
        margin: '0 3px',
        opacity: 0.8,
        position: 'relative',
        top: '4px',
    },
    unfolded: {
        marginRight: theme.spacing(2),
    }
}));

export const SongListItemTextSecondary = ({ smallDevice, song, unfolded }) => {
    const classes = useStyles();

    let { auteur, compositeur, editeur, pg, traducteur } = song;
    let details = [];
    const lyrics = pg && pg[0] && pg[0].pg ? pg[0].pg.replace(/<br\/>/g, ' ') : '';

    if (compositeur && compositeur != auteur) details.push({
        key: 'Music: ',
        before: null,
        name: compositeur,
        icon: MusicNote,
        after: null,
    });
    if (auteur) details.push({
        key: 'Text: ',
        before: details.length && ' · ',
        name: auteur,
        icon: TextFields,
        after: null,
    });
    if (traducteur) details.push({
        key: 'Translation: ',
        before: details.length && ' · ',
        name: traducteur,
        icon: Translate,
        after: null,
    });
    if (editeur) details.push({
        key: 'Edition: ',
        before: details.length && ' (',
        name: editeur,
        icon: null,
        after: details.length && ')',
    });

    return (
        <div className={unfolded ? classes.unfolded : classes.folded}>
            {(!smallDevice || unfolded) && <Typography>
                {details.map(detail =>
                    <span key={detail.key}>
                        {detail.before}
                        {detail.icon && <detail.icon className={classes.inlineIcons} />}
                        {!smallDevice && unfolded && detail.key}
                        {detail.name}
                        {detail.after}
                    </span>
                )}
                {!smallDevice && !unfolded && <span> — {lyrics}</span>}
            </Typography>}
            {(smallDevice || unfolded) && <Typography>{lyrics}</Typography>}
        </div>
    );
};

SongListItemTextSecondary.propTypes = {
    smallDevice: PropTypes.bool.isRequired,
    song: PropTypes.object.isRequired,
    unfolded: PropTypes.bool.isRequired,
};

export default SongListItemTextSecondary;
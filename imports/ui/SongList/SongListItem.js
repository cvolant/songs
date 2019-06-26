import { Meteor } from 'meteor/meteor';
import React from 'react';
import { PropTypes } from 'prop-types';
import { Session } from 'meteor/session';
import { withTracker } from 'meteor/react-meteor-data';
import { withStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import NoteIcon from '@material-ui/icons/Note';
import Check from '@material-ui/icons/Check';
import useMediaQuery from '@material-ui/core/useMediaQuery';

const styles = theme => ({
/* 
    listItem: {
        [theme.breakpoints.up('lg')]: {
            width: '50%',
        },
    },
*/
    text: {
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
    },
});

export const SongListItem = props => {
    const { classes, handleSelect, handleUnfold, selectedSongId, song, unfolded } = props;
    let smallDevice = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <ListItem
            button={!unfolded}
            className={classes.listItem}
            component={unfolded ? Card : undefined}
            divider
            selected={selectedSongId === song._id}
            onClick={handleUnfold}
        >
            {
                smallDevice ? null :
                    <ListItemIcon>
                        <NoteIcon />
                    </ListItemIcon>
            }
            <ListItemText
                classes={{ primary: classes.text, secondary: classes.text }}
                primary={
                    <React.Fragment>
                        {song.titre || <em>Untitled song</em>}
                        {song.sousTitre && !smallDevice ? <em> &mdash; {song.sousTitre}</em> : null}
                        {song.annee ? ` (${song.annee})` : null}
                        {smallDevice && song.auteur ? ` · ${song.auteur}` : null}
                    </React.Fragment>
                }
                primaryTypographyProps={{ component: 'h6' }}
                secondary={
                    <React.Fragment>
                        {!smallDevice && song.auteur ? song.auteur : null}
                        {!smallDevice && song.compositeur && song.compositeur != song.auteur ? (song.auteur ? ' · ' : '') + song.compositeur : null}
                        {!smallDevice && song.editeur ? (song.auteur || song.compositeur ? ` (${song.editeur})` : song.editeur) : null}
                        {song.pg && song.pg[0] && song.pg[0].pg ? <em>{(!smallDevice && (song.auteur || song.compositeur || song.editeur) ? ' — ' : '') + song.pg[0].pg.replace(/<br\/>/g, ' / ')}</em> : null}
                    </React.Fragment>
                }
            />
            <IconButton onClick={handleSelect}>
                <Check />
            </IconButton>
        </ListItem>
    );
};

SongListItem.propTypes = {
    classes: PropTypes.object.isRequired,
    handleSelect: PropTypes.func.isRequired,
    handleUnfold: PropTypes.func.isRequired,
    meteorCall: PropTypes.func.isRequired,
    selectedSongId: PropTypes.string,
    song: PropTypes.object.isRequired,
};

export default withTracker(props => {
    return {
        meteorCall: Meteor.call,
        selectedSongId: Session.get('selectedSongId'),
    };
})(withStyles(styles)(SongListItem));
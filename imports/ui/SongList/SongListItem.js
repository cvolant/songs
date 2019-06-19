import { Meteor } from 'meteor/meteor';
import React from 'react';
import { PropTypes } from 'prop-types';
import { Session } from 'meteor/session';
import { withTracker } from 'meteor/react-meteor-data';
import { withStyles } from '@material-ui/core/styles';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import NoteIcon from '@material-ui/icons/Note';

const styles = theme => ({
    text: {
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
    },
});

export const SongListItem = props => {
    const { classes, selectedSongId, song } = props;

    return (
        <ListItem
            button
            divider
            selected={selectedSongId === song._id}
            onClick={() => Session.set('selectedSongId', song._id._str)}
        >
            <ListItemIcon>
                <NoteIcon />
            </ListItemIcon>
            <ListItemText
                classes={{ primary: classes.text, secondary: classes.text }}
                primary={
                    <React.Fragment>
                        {song.titre || <em>Untitled song</em>}
                        {song.sousTitre ? <em> &mdash; {song.sousTitre}</em> : null}
                        {song.annee ? ` (${song.annee})` : null}
                    </React.Fragment>
                }
                primaryTypographyProps={{ component: 'h6' }}
                secondary={
                    <React.Fragment>
                        {song.auteur ? song.auteur : null}
                        {song.compositeur && song.compositeur != song.auteur ? (song.auteur ? ' · ' : '') + song.compositeur : null}
                        {song.editeur ? (song.auteur || song.compositeur ? ` (${song.editeur})` : song.editeur) : null}
                        {song.pg && song.pg[0] && song.pg[0].pg ? <em>{(song.auteur || song.compositeur || song.editeur ? ' — ' : '') + song.pg[0].pg.replace(/<br\/>/g, ' ')}</em> : null}
                    </React.Fragment>
                }
            />
        </ListItem>
    );
};

SongListItem.propTypes = {
    song: PropTypes.object.isRequired,
    meteorCall: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    selectedSongId: PropTypes.string,
};

export default withTracker(props => {
    return {
        meteorCall: Meteor.call,
        selectedSongId: Session.get('selectedSongId'),
    };
})(withStyles(styles)(SongListItem));
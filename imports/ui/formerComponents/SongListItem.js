import { Meteor } from 'meteor/meteor';
import React from 'react';
import moment from 'moment';
import { PropTypes } from 'prop-types';
import { Session } from 'meteor/session';
import { withTracker } from 'meteor/react-meteor-data';
import { withStyles } from '@material-ui/core/styles';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import NoteIcon from '@material-ui/icons/Note';

const styles = theme => ({
    root: {
        width: '100%',
        borderBottom: '1px solid rgba(0, 0, 0, 0.08)'
    },
});

export const SongListItem = props => {
    const { classes } = props;
    const extractLength = 20;
    const bodyExtract = props.song.pg && props.song.pg[0] && props.song.pg[0].pg ? (' - ' + props.song.pg[0].pg.substring(0, extractLength) + (props.song.pg[0].pg.length > extractLength ? '...' : '')) : '';
    return (
        <ListItem
            button
            className={classes.root}
            selected={props.selectedSongId === props.song._id}
            onClick={() => {
                console.log(props.song._id);
                props.Session.set('selectedSongId', props.song._id._str);
            }}
        >
            <ListItemIcon>
                <NoteIcon />
            </ListItemIcon>
            <ListItemText
                primary={props.song.titre || 'Untitled song'}
                secondary={
                    <span>{props.song.annee}
                        <span className={props.searchFocus ? 'item__extract item__extract--visible' : 'item__extract'}>
                            &nbsp;{bodyExtract}
                        </span>
                    </span>
                }
            />
        </ListItem>
    );
};

SongListItem.propTypes = {
    song: PropTypes.object.isRequired,
    Session: PropTypes.object.isRequired,
    meteorCall: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    selectedSongId: PropTypes.string,
    searchFocus: PropTypes.bool
};

export default withTracker(props => {
    return {
        meteorCall: Meteor.call,
        Session,
        selectedSongId: Session.get('selectedSongId'),
        searchFocus: Session.get('searchFocus')
    };
})(withStyles(styles)(SongListItem));
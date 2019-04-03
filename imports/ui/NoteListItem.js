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
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
});

export const NoteListItem = props => {
    const { classes } = props;
    const extractLength = 20;
    const bodyExtract = props.note.body ? (' - ' + props.note.body.substring(0, extractLength) + (props.note.body.length > extractLength ? '...' : '')) : '';
    return (
        <ListItem
        button
        selected={props.selectedNoteId === props.note._id}
        onClick={() => {
            props.Session.set('selectedNoteId', props.note._id);
        }}
        >
            <ListItemIcon>
                <NoteIcon />
            </ListItemIcon>
            <ListItemText
                primary={props.note.title || 'Untitled note'}
                secondary={<span>{moment(props.note.updatedAt).format('DD/MM/YYYY')}<span className={props.searchFocus ? 'item__extract item__extract--visible' : 'item__extract'}>&nbsp;{bodyExtract}</span></span>}
            />
        </ListItem>
    );
};

NoteListItem.propTypes = {
    note: PropTypes.object.isRequired,
    Session: PropTypes.object.isRequired,
    meteorCall: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    selectedNoteId: PropTypes.string,
    searchFocus: PropTypes.bool
};

export default withTracker(props => {
    return {
        meteorCall: Meteor.call,
        Session,
        selectedNoteId: Session.get('selectedNoteId'),
        searchFocus: Session.get('searchFocus')
    };
})(withStyles(styles)(NoteListItem));
import React from 'react';
import { Meteor } from 'meteor/meteor';
import { PropTypes } from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { withStyles } from '@material-ui/core/styles';

import List from '@material-ui/core/List';

import { Notes } from '../api/notes';
import NoteListItem from './NoteListItem';
import NoteListHeader from './NoteListHeader';
import NoteListEmptyItem from './NoteListEmptyItem';

const styles = theme => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
});

export const NoteList = props => {
    const { classes } = props;
    return (
        <List component="nav" className='item-list'>
            <NoteListHeader />
            {props.notes.length === 0 ?
                <NoteListEmptyItem />
                :
                props.notes.map(note => {
                    return (
                        <NoteListItem key={note._id} note={note} />
                    );
                })
            }
        </List>
    );
};

NoteList.propTypes = {
    notes: PropTypes.array.isRequired,
    classes: PropTypes.object.isRequired,
};

export default withTracker(props => {
    Meteor.subscribe('notes');

    return {
        notes: Notes.find({}, { sort: { updatedAt: -1 } }).fetch()
    };
})(withStyles(styles)(NoteList));
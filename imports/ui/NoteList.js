import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { PropTypes } from 'prop-types';
import FlipMove from 'react-flip-move';
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
        backgroundColor: theme.palette.secondary.light,
    },
});

export const NoteList = props => {
    const { classes } = props;
    const [searchEntry, setSearchEntry] = useState('');

    const handleSearch = (e) => {
        setSearchEntry(e.target.value);
    }

    return (
        <div className='item-list__container'>
            <NoteListHeader handleSearch={handleSearch} searchEntry={searchEntry} />
            <List component="nav" className='item-list'>
                {props.notesTriees.length === 0 ?
                    <NoteListEmptyItem />
                    :
                    <FlipMove maintainContainerHeight={true}>
                        {props.notesTriees(searchEntry).map(note => {
                            return (
                                <NoteListItem key={note._id} note={note} />
                            );
                        })}
                    </FlipMove>
                }
            </List>
        </div>
    );
};

NoteList.propTypes = {
    notesTriees: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
};

export default withTracker(props => {
    Meteor.subscribe('notes');
    const notes = Notes.find({}, { sort: { updatedAt: -1 } }).fetch();
    const notesTriees = searchEntry => {
        const regex = searchEntry ? searchEntry : '';
        const notes = Notes.find({ $or: [{ title: { $regex: regex, $options: 'i' } }, { body: { $regex: regex, $options: 'i' } }] }, { sort: { updatedAt: -1 } }).fetch();
        return notes;
    }
    return {
        notesTriees
    };
})(withStyles(styles)(NoteList));
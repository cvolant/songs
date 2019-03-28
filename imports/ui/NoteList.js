import React from 'react';
import { Meteor } from 'meteor/meteor';
import { PropTypes } from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Notes } from '../api/notes';
import NoteListItem from './NoteListItem';
import NoteListHeader from './NoteListHeader';
import NoteListEmptyItem from './NoteListEmptyItem';

export const NoteList = (props) => {
    return (
        <div className='item-list'>
            <NoteListHeader />
            {props.notes.length === 0 ? <NoteListEmptyItem /> : props.notes.map((note) => {return <NoteListItem key={note._id} note={note} />;})}
        </div>
    );
};

NoteList.propTypes = {
    notes: PropTypes.array.isRequired
};

export default withTracker(props => {
    Meteor.subscribe('notes');

    return {
        notes: Notes.find({}, {sort: { updatedAt : -1 }}).fetch()
    };
})(NoteList);
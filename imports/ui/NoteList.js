import React from 'react';
import { Meteor } from 'meteor/meteor';
import { PropTypes } from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import { Notes } from '../api/notes';
import NoteListItem from './NoteListItem';
import NoteListHeader from './NoteListHeader';
import NoteListEmptyItem from './NoteListEmptyItem';

export const NoteList = (props) => {
    return (
        <div>
            <NoteListHeader />
            NoteList - Nb notes = {props.notes.length}
            {props.notes.length === 0 ? <NoteListEmptyItem /> : props.notes.map((note) => {return <NoteListItem key={note._id} note={note} />;})}
        </div>
    );
};

NoteList.propTypes = {
    notes: PropTypes.array.isRequired
};

export default createContainer(() => {
    Meteor.subscribe('notes');

    return {
        notes: Notes.find().fetch()
    };
}, NoteList);
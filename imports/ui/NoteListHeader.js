import {Meteor} from 'meteor/meteor';
import React from 'react';
import {PropTypes} from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';

export const NoteListHeader = (props) => {
    return (
        <div>
            NoteListHeader
            <button name='addNoteButton' onClick={() => props.meteorCall('notes.insert')}>Add note</button>
        </div>
    );
};

NoteListHeader.propTypes = {
    meteorCall: PropTypes.func.isRequired
};

export default createContainer(() => {
    return {
        meteorCall: Meteor.call
    };
}, NoteListHeader);
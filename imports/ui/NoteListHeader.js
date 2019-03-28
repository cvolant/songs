import {Meteor} from 'meteor/meteor';
import React from 'react';
import {PropTypes} from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session';

export const NoteListHeader = (props) => {
    return (
        <div className='item-list__header'>
            <button className='button' name='addNoteButton' onClick={() => props.meteorCall('notes.insert', (err, res) => {
                if (res) {
                    props.Session.set('selectedNoteId', res);
                }
            })}>Add note</button>
        </div>
    );
};

NoteListHeader.propTypes = {
    meteorCall: PropTypes.func.isRequired,
    Session: PropTypes.object.isRequired
};

export default withTracker(props => {
    return {
        meteorCall: Meteor.call,
        Session
    };
})(NoteListHeader);
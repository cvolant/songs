import { Meteor } from 'meteor/meteor';
import React from 'react';
import moment from 'moment';
import { PropTypes } from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session';

export const NoteListItem = (props) => {
    return (
        <div onClick={() => {
            props.Session.set('selectedNodeValue', props.note._id);
        }}>
            <h5>{props.note.title ? props.note.title : 'Untitled note'}</h5>
            <p>Last update : {moment(props.note.updatedAt).format('DD/MM/YYYY')}</p>
            <button onClick={() => { props.meteorCall('notes.remove', props.note._id) }}>&times;</button>
        </div>
    );
};

NoteListItem.propTypes = {
    note: PropTypes.object.isRequired,
    Session: PropTypes.object.isRequired,
    meteorCall: PropTypes.func.isRequired
};

export default createContainer(() => {
    return {
        meteorCall: Meteor.call,
        Session
    };
}, NoteListItem);
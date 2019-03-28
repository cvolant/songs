import { Meteor } from 'meteor/meteor';
import React from 'react';
import moment from 'moment';
import { PropTypes } from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session';

export const NoteListItem = (props) => {
    const className = (props.selectedNodeId === props.note._id) ? 'item item--selected' : 'item';
    return (
        <div className={className} onClick={() => {
            props.Session.set('selectedNodeId', props.note._id);
        }}>
            <h5 className='item__title'>{props.note.title || 'Untitled note'}</h5>
            <p className='item__subtitle'>Last update : {moment(props.note.updatedAt).format('DD/MM/YYYY')}</p>
        </div>
    );
};

NoteListItem.propTypes = {
    note: PropTypes.object.isRequired,
    Session: PropTypes.object.isRequired,
    meteorCall: PropTypes.func.isRequired
};

export default withTracker(props => {
    return {
        meteorCall: Meteor.call,
        Session,
        selectedNodeId: Session.get('selectedNodeId')
    };
})(NoteListItem);
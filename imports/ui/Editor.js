import React from 'react';
import { Session } from 'meteor/session';
import { PropTypes } from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import { Notes } from '../api/notes';
import { Meteor } from 'meteor/meteor';

export class Editor extends React.Component {
    handleBodyChange(e) {
        this.props.meteorcall('notes.update', this.props.note._id, {
            body: e.target.value
        });
    }
    handleTitleChange(e) {
        this.props.meteorcall('notes.update', this.props.note._id, {
            title: e.target.value
        });
    }
    render() {
        if (this.props.note) {
            return (
                <div>
                    <input value={this.props.note.title} placeholder='Title' onChange={this.handleTitleChange.bind(this)} />
                    <textarea value={this.props.note.body} placeholder='Your note here' onChange={this.handleBodyChange.bind(this)}></textarea>
                    <button>Delete Note</button>
                </div>
            );
        } else {
            return (
                (this.props.selectedNodeId) ? <p>Note note found.</p> : <p>Pick or create a note to get started.</p>
            );
        }
    }
}

Editor.propTypes = {
    selectedNodeId: PropTypes.string,
    meteorcall: PropTypes.func.isRequired,
    note: PropTypes.object
}

export default createContainer(() => {
    const selectedNodeId = Session.get('selectedNodeId');

    return {
        selectedNodeId,
        meteorcall: Meteor.call,
        note: Notes.findOne(selectedNodeId)
    };
}, Editor);
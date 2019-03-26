import React from 'react';
import { Session } from 'meteor/session';
import { PropTypes } from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import { Notes } from '../api/notes';
import { Meteor } from 'meteor/meteor';

export class Editor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            body: ''
        };
    };

    handleDelete(e) {
        this.props.meteorCall('notes.remove', this.props.note._id);
        this.props.setSelectedNodeId(undefined);
    }
    handleBodyChange(e) {
        const body = e.target.value;
        this.setState({ body });
        this.props.meteorCall('notes.update', this.props.note._id, { body });
    }
    handleTitleChange(e) {
        const title = e.target.value;
        this.setState({ title });
        this.props.meteorCall('notes.update', this.props.note._id, { title });
    }
    componentDidUpdate(prevProps, prevState) {
        const currentNoteId = this.props.note ? this.props.note._id : undefined;
        const prevNodeId = prevProps.note ? prevProps.note._id : undefined;

        if (currentNoteId && currentNoteId !== prevNodeId) {
            this.setState({
                title: this.props.note.title,
                body: this.props.note.body
            });
        }
    }
    render() {
        if (this.props.note) {
            return (
                <div className='editor'>
                    <input value={this.state.title} placeholder='Title' onChange={this.handleTitleChange.bind(this)} />
                    <textarea value={this.state.body} placeholder='Your note here' onChange={this.handleBodyChange.bind(this)}></textarea>
                    <button onClick={this.handleDelete.bind(this)}>Delete Note</button>
                </div>
            );
        } else {
            return (
                <div className='editor'>
                    {(this.props.selectedNodeId) ? <p>Note not found.</p> : <p>Pick or create a note to get started.</p>}
                </div>
            );
        }
    }
}

Editor.propTypes = {
    selectedNodeId: PropTypes.string,
    setSelectedNodeId: PropTypes.func.isRequired,
    meteorCall: PropTypes.func.isRequired,
    note: PropTypes.object
}

export default createContainer(() => {
    const selectedNodeId = Session.get('selectedNodeId');
    const setSelectedNodeId = (newId) => {
        Session.set('selectedNodeId', newId);
    };

    return {
        selectedNodeId,
        setSelectedNodeId,
        meteorCall: Meteor.call,
        note: Notes.findOne(selectedNodeId)
    };
}, Editor);
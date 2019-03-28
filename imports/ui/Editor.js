import React from 'react';
import { Session } from 'meteor/session';
import { PropTypes } from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Notes } from '../api/notes';
import { Meteor } from 'meteor/meteor';

export class Editor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            body: ''
        };
        this.titleInput = React.createRef();
        this.bodyInput = React.createRef();
    };

    handleDelete(e) {
        this.props.meteorCall('notes.remove', this.props.note._id);
        this.props.setselectedNoteId(undefined);
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
    componentWillUnmount() {
        Session.set('selectedNoteId', undefined);
    }
    render() {
        if (this.props.note) {
            return (
                <div className='editor'>
                    <input className='editor__title' ref={this.titleInput} value={this.state.title} placeholder='Title' onChange={this.handleTitleChange.bind(this)} />
                    <textarea className='editor__body' ref={this.bodyInput} value={this.state.body} placeholder='Your note here' onChange={this.handleBodyChange.bind(this)}></textarea>
                    <div><button className='button button__secondary' onClick={this.handleDelete.bind(this)}>Delete Note</button></div>
                </div>
            );
        } else {
            return (
                <div className='editor__message'>
                    {(this.props.selectedNoteId) ? <p>Note not found.</p> : <p>Pick or create a note to get started.</p>}
                </div>
            );
        }
    }
}

Editor.propTypes = {
    selectedNoteId: PropTypes.string,
    setselectedNoteId: PropTypes.func.isRequired,
    meteorCall: PropTypes.func.isRequired,
    note: PropTypes.object
}

export default withTracker(props => {
    const selectedNoteId = Session.get('selectedNoteId');
    const setselectedNoteId = (newId) => {
        Session.set('selectedNoteId', newId);
    };

    return {
        selectedNoteId,
        setselectedNoteId,
        meteorCall: Meteor.call,
        note: Notes.findOne(selectedNoteId)
    };
})(Editor);
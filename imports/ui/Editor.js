import React from 'react';
import { Session } from 'meteor/session';
import { PropTypes } from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Notes } from '../api/notes';
import { Meteor } from 'meteor/meteor';
import { withStyles } from '@material-ui/core/styles';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import classNames from 'classnames';

const styles = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
    },
    button: {
      margin: theme.spacing.unit,
    },
    extendedIcon: {
        marginRight: theme.spacing.unit,
    },
});

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
    componentDidMount() {
        if (this.refs.title && this.refs.body) {
            if (this.props.note.title) {
                //                this.refs.body.focus();
            } else {
                //                this.refs.title.focus();
            }
        }
    }
    componentDidUpdate(prevProps, prevState) {
        const currentNoteId = this.props.note ? this.props.note._id : undefined;
        const prevNodeId = prevProps.note ? prevProps.note._id : undefined;

        if (currentNoteId && currentNoteId !== prevNodeId) {
            this.setState({
                title: this.props.note.title,
                body: this.props.note.body
            });
            this.componentDidMount();
        }
    }
    componentWillUnmount() {
        Session.set('selectedNoteId', undefined);
    }
    render() {
        const { classes } = this.props;
        if (this.props.note) {
            return (
                <div className={`editor ${classes.container}`}>
                    <TextField
                        label="Title"
                        ref='title'
                        multiline
                        rowsMax="2"
                        className={classes.textField}
                        margin="normal"
                        variant="outlined"
                        value={this.state.title}
                        onChange={this.handleTitleChange.bind(this)}
                        autoFocus={true}
                    />
                    <TextField
                        label="Your note here"
                        multiline
                        //                        rows="4"
                        className={classes.textField}
                        margin="normal"
                        variant="outlined"
                        value={this.state.body}
                        onChange={this.handleBodyChange.bind(this)}
                    />
                    <Button variant="outlined" color="secondary" className={classes.button} onClick={this.handleDelete.bind(this)}>
                        <DeleteIcon />
                        Delete note
                    </Button>
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
    classes: PropTypes.object.isRequired,
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
})(withStyles(styles)(Editor));
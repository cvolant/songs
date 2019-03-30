import { Meteor } from 'meteor/meteor';
import React from 'react';
import { PropTypes } from 'prop-types';
import { Session } from 'meteor/session';
import { withTracker } from 'meteor/react-meteor-data';
import { withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
});

export const NoteListHeader = props => {
    const { classes } = props;
    return (
        <div className='item-list__header'>
            <Button variant="contained" name='addNoteButton' color="primary" className={classes.button} onClick={() => props.meteorCall('notes.insert', (err, res) => {
                if (res) {
                    props.Session.set('selectedNoteId', res);
                }
            })}>
                Add note
            </Button>
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
})(withStyles(styles)(NoteListHeader));
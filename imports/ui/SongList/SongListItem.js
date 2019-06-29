import { Meteor } from 'meteor/meteor';
import React from 'react';
import { PropTypes } from 'prop-types';
import { Session } from 'meteor/session';
import { withTracker } from 'meteor/react-meteor-data';

import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import NoteIcon from '@material-ui/icons/Note';
import Check from '@material-ui/icons/Check';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import SongListItemTextSecondary from './SongListItemTextSecondary';
import SongListItemTextPrimary from './SongListItemTextPrimary';

const useStyles = makeStyles(theme => ({
    root: {
        paddingLeft: 0,
    },
    secondaryAction: {
        right: 0,
    },
}));

export const SongListItem = props => {
    const classes = useStyles();
    const { handleSelect, handleUnfold, selectedSongId, song, unfolded } = props;
    let smallDevice = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <ListItem
            button={!unfolded}
            className={classes.root}
            divider
            selected={selectedSongId === song._id}
            onClick={handleUnfold}
        >
            {
                smallDevice ? null :
                    <ListItemIcon>
                        <NoteIcon />
                    </ListItemIcon>
            }
            <ListItemText
                disableTypography
                primary={<SongListItemTextPrimary { ...{smallDevice, song, unfolded} } />}
                secondary={<SongListItemTextSecondary { ...{smallDevice, song, unfolded} } />}
            />
            <ListItemSecondaryAction className={classes.secondaryAction}>
                <IconButton onClick={handleSelect}>
                    <Check />
                </IconButton>
            </ListItemSecondaryAction>
        </ListItem>
    );
};

SongListItem.propTypes = {
    handleSelect: PropTypes.func.isRequired,
    handleUnfold: PropTypes.func.isRequired,
    meteorCall: PropTypes.func.isRequired,
    selectedSongId: PropTypes.string,
    song: PropTypes.object.isRequired,
};

export default withTracker(props => {
    return {
        meteorCall: Meteor.call,
        selectedSongId: Session.get('selectedSongId'),
    };
})(SongListItem);
import { Meteor } from 'meteor/meteor';
import React from 'react';
import { PropTypes } from 'prop-types';
import { Session } from 'meteor/session';
import { withTracker } from 'meteor/react-meteor-data';
import { withStyles } from '@material-ui/core/styles';

import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import { fade } from '@material-ui/core/styles/colorManipulator';

const styles = theme => ({
    root: {
        width: '100%',
    },
    grow: {
        flexGrow: 1,
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing.unit,
            width: 'auto',
        },
    },
    searchIcon: {
        width: theme.spacing.unit * 8,
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
        width: '100%',
    },
    inputInput: {
        paddingTop: theme.spacing.unit,
        paddingRight: theme.spacing.unit,
        paddingBottom: theme.spacing.unit,
        paddingLeft: theme.spacing.unit * 7,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '100%',
/*             width: 120,
            '&:focus': {
                width: 200,
            }, */
        },
    },
    fab: {
        margin: theme.spacing.unit,
        position: 'relative',
        top: '36px',
        marginLeft: '2.5rem'
    },
});

export const NoteListHeader = props => {
    const { classes } = props;
    const handleFocus = () => {
        Session.set('searchFocus', true);
    };
    const handleFocusOut = () => {
        Session.set('searchFocus', false);
    };

    return (
        <div className='item-list__header'>
            <AppBar className='MuiPaper-rounded-15' color='secondary' position="static">
                <Toolbar>
                    <div className={classes.grow} />
                    <div className={classes.search}>
                        <div className={classes.searchIcon}>
                            <SearchIcon />
                        </div>
                        <InputBase
                            placeholder="Search…"
                            classes={{
                                root: classes.inputRoot,
                                input: classes.inputInput,
                            }}
                            value={props.searchEntry}
                            onChange={props.handleSearch.bind(this)}
                            onFocus={handleFocus}
                            onBlur={handleFocusOut}
                        />
                    </div>
                    <div>
                        <Fab
                            name='addNoteButton'
                            color="primary"
                            aria-label="Add"
                            className={classes.fab}
                            onClick={() => props.meteorCall('notes.insert', (err, res) => {
                                if (res) {
                                    props.Session.set('selectedNoteId', res);
                                }
                            })}
                        >
                            <AddIcon />
                        </Fab>
                    </div>
                </Toolbar>
            </AppBar>
        </div>
    );
};

NoteListHeader.propTypes = {
    meteorCall: PropTypes.func.isRequired,
    Session: PropTypes.object.isRequired,
    handleSearch: PropTypes.func.isRequired,
    searchEntry: PropTypes.string,
};

export default withTracker(props => {
    return {
        meteorCall: Meteor.call,
        Session
    };
})(withStyles(styles)(NoteListHeader));
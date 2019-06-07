import { Meteor } from 'meteor/meteor';
import React from 'react';
import { PropTypes } from 'prop-types';
import { Session } from 'meteor/session';
import { withTracker } from 'meteor/react-meteor-data';
import { withStyles } from '@material-ui/core/styles';

import Fab from '@material-ui/core/Fab';
import SyncIcon from '@material-ui/icons/Sync';
import SyncDisabledIcon from '@material-ui/icons/SyncDisabled';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import { fade } from '@material-ui/core/styles/colorManipulator';

const styles = theme => ({
    root: {
        width: '100%',
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
        /* 
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(1),
            width: 'auto',
        },
        */
    },
    searchIcon: {
        width: theme.spacing(8),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#555',
    },
    inputRoot: {
        color: 'inherit',
        width: '100%',
    },
    inputInput: {
        paddingTop: theme.spacing(1),
        paddingRight: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        paddingLeft: theme.spacing(7),
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
});

export const SongListHeader = props => {
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
                </Toolbar>
            </AppBar>
        </div>
    );
};

SongListHeader.propTypes = {
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
})(withStyles(styles)(SongListHeader));
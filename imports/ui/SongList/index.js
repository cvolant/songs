import React, { useState, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { PropTypes } from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { withStyles } from '@material-ui/core/styles';

import {
    LinearProgress,
    List
} from '@material-ui/core';

import { Songs } from '../../api/songs';
import SongListItem from './SongListItem';
import SongListEmptyItem from './SongListEmptyItem';

const styles = theme => ({
    root: {
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
    },
});

const sameObjects = (object1, object2) => {
    if (object1.length != object2.length) return false;
    if (Object.keys(object1).length != Object.keys(object2).length) return false;
    for (let key in object1) {
        if (typeof object2[key] != 'undefined') {
            if (typeof object1[key] == 'object' || typeof object1[key] == 'array') {
                if (!sameObjects(object1[key], object2[key])) return false;
            } else {
                if (object1[key] != object2[key]) return false;
            }
        }
    }
    return true;
};

export const SongList = props => {
    const { classes, songs, search } = props;
    const [currentSearch, setCurrentSearch] = useState(search);
    const [subscription, setSubscription] = useState({}/* Meteor.subscribe('songs', search) */);
    console.log('From SongList. render. props:', props);
    useEffect(() => {
        console.log('From SongList, useEffect. search:', search, ', currentSearch:', currentSearch);
        if (!sameObjects(search, currentSearch)) {
            console.log('From SongList, useEffect. newSearch. search:', search);
            if (subscription) {
                console.log('From SongList, useEffect. Stop subscription.');
                subscription.stop && subscription.stop();
            }
            if (search.globalQuery || search.specificQueries.length) setSubscription(Meteor.subscribe('songs', search));
            setCurrentSearch(search);
        }
    });

    return (
        <div className={classes.root}>
            <List component="nav" className='item-list'>
                {subscription.value && !subscription.value.ready() ? <LinearProgress /> : ''}
                {songs.length === 0 ?
                    <SongListEmptyItem search={search} />
                    :
                    songs.map(song => {
                        return (
                            <SongListItem key={song._id} song={song} />
                        );
                    })
                }
            </List>
        </div>
    );
};

SongList.propTypes = {
    songs: PropTypes.array.isRequired,
    classes: PropTypes.object.isRequired,
    search: PropTypes.object,
};

export default withTracker(props => {

    const search = Session.get('search');
    console.log('From SongList, withTracker. search:', search);

    return {
        songs: Songs.find({}, { sort: { annee: -1 }, limit: 20 }).fetch(),
        search,
    };
})(withStyles(styles)(SongList));
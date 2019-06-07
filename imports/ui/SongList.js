import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { PropTypes } from 'prop-types';
import FlipMove from 'react-flip-move';
import { withTracker } from 'meteor/react-meteor-data';
import { withStyles } from '@material-ui/core/styles';

import {
    LinearProgress,
    List
} from '@material-ui/core';

import { Songs } from '../api/songs';
import SongListItem from './SongListItem';
import SongListHeader from './SongListHeader';
import SongListEmptyItem from './SongListEmptyItem';

const styles = theme => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.secondary.light,
    },
});

export const SongList = props => {
    const { classes } = props;
    const [searchEntry, setSearchEntry] = useState('');
    const [delay, setDelay] = useState(undefined);

    const handleSearch = (e) => {
        const newEntry = e.target.value;
        setSearchEntry(newEntry);

        const specificEntries = newEntry.match(/\$\w+\[.*?(\]|\$|$)/g) || [];
        console.log('specificEntries:', specificEntries);

        let specificQueries = {};

        if (specificEntries.length > 0) {
            specificEntries.map(specificEntry => {
                const queryFirstChar = specificEntry.indexOf('[') + 1;
                const queryLastChar = specificEntry[specificEntry.length - 1] == ']' ? specificEntry.length - 1 : specificEntry.length;
                const field = specificEntry.substring(1, queryFirstChar - 1);
                const query = new RegExp(specificEntry.substring(queryFirstChar, queryLastChar), 'i');
                specificQueries[field] = query;
            });
            console.log('specificQueries:', specificQueries);
        }

        const globalQuery = newEntry.replace(/(\$.*?\[.*?(\]|\$|$))|\$\w+(\W|$)/g, '').replace(/(\W\w\W)|\W+/g, ' ').trim();

        clearTimeout(delay);
        setDelay(setTimeout(() => {
            console.log('Time out');
            if (specificQueries === {}) Session.set('search', { globalQuery, specificQueries: '' });
            else Session.set('search', { globalQuery, specificQueries });
            props.stopSubscription();
        }, 700));
    }

    return (
        <div className='item-list__container'>
            <SongListHeader
                handleSearch={handleSearch}
                searchEntry={searchEntry}
            />
            <List component="nav" className='item-list'>
                {props.loading ? <LinearProgress /> : ''}
                {props.songs.length === 0 ?
                    <SongListEmptyItem />
                    :
                    <FlipMove maintainContainerHeight={true}>
                        {props.songs.map(song => {
                            return (
                                <SongListItem key={song._id} song={song} />
                            );
                        })}
                    </FlipMove>
                }
            </List>
        </div>
    );
};

SongList.propTypes = {
    songs: PropTypes.array.isRequired,
    stopSubscription: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
};

export default withTracker(props => {

    const subscription = Meteor.subscribe('songs', Session.get('search'));
    const loading = !subscription.ready();

    const stopSubscription = () => {
        if (subscription) subscription.stop();
    }

    return {
        songs: Songs.find({}, { sort: { annee: -1 }, limit: 20 }).fetch(),
        stopSubscription,
        loading
    };
})(withStyles(styles)(SongList));
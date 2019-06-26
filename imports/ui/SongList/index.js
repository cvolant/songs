import React, { useState, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { PropTypes } from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { makeStyles } from '@material-ui/core/styles';

import {
    LinearProgress,
    List
} from '@material-ui/core';

import { Songs } from '../../api/songs';
import SongListItem from './SongListItem';
import SongListEmptyItem from './SongListEmptyItem';

const useStyles = makeStyles(theme => ({
/* 
    progressBar: {
        width: ({ extended }) => `calc(100% - 15rem + ${5 * extended}rem)`,
        margin: theme.spacing(0, 1),
    },
*/
    root: {
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
    },
}));

export const SongList = props => {
    const { /* extended, */ handleSelectSong, /* loading, */ songs, search, setLoading } = props;
    const [unfoldedSong, setUnfoldedSong] = useState(undefined);
    /* const [loading, setLoading] = useState(false); */
    const classes = useStyles({ /* extended */ });
    
    console.log('From SongList. render. props:', props);

    useEffect(() => {
        console.log('From SongList, useEffect. search:', search);
        if (search && (search.globalQuery || (search.specificQueries && Object.keys(search.specificQueries).length))) {
            console.log('From SongList, useEffect. search:', search);            
            setLoading(true);
            const subscription = Meteor.subscribe('songs', search);
            console.log('From SongList, useEffect. subscription:', subscription);            
            return () => {
                console.log('From SongList, useEffect. Stop subscription.');
                subscription.stop();
            };
        }
    }, [JSON.stringify(search)]);
    useEffect(() => {
        setLoading(false);
    }, [songs]);

    const handleSelect = song => () => {
        handleSelectSong(song);
    };

    const handleUnfold = songId => () => {
        setUnfoldedSong(songId);
    };
    
    return (
            <List component="nav" className={classes.root}>
                {/* loading ? <LinearProgress className={classes.progressBar} /> : '' */}
                {songs.length === 0 && search ?
                    <SongListEmptyItem search={search} />
                    :
                    songs.map(song => {
                        return (
                            <SongListItem
                                key={song._id}
                                song={song}
                                handleSelect={handleSelect(song)}
                                handleUnfold={handleUnfold(song._id)}
                                unfolded={unfoldedSong == song._id}
                            />
                        );
                    })
                }
            </List>
    );
};

SongList.propTypes = {
    handleSelectSong: PropTypes.func.isRequired,
    /* loading: PropTypes.bool, */
    songs: PropTypes.array.isRequired,
    search: PropTypes.object,
    setLoading: PropTypes.func.isRequired,
};

export default withTracker(props => {

    const search = Session.get('search');
    console.log('From SongList, withTracker. search:', search);

    return {
        songs: Songs.find({}).fetch(),
        search,
    };
})(SongList);
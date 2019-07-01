import React, { useState, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { PropTypes } from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { makeStyles } from '@material-ui/core/styles';

import List from '@material-ui/core/List';

import { Songs } from '../../api/songs';
import SongListItem from './SongListItem';
import SongListEmptyItem from './SongListEmptyItem';

const useStyles = makeStyles(theme => ({
    root: {
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        overflowScrolling: 'touch',
        width: '100%',
    },
}));

export const SongList = props => {
    const { /* extended, */ handleSelectSong, loading, /* songs, */ search, stopLoading } = props;
    const [unfoldedSong, setUnfoldedSong] = useState(undefined);
    /* const [loading, stopLoading] = useState(false); */
    const classes = useStyles({ /* extended */ });
    const [songs, setSongs] = useState([]);
    
    console.log('From SongList. render. props:', props);
/* 
    useEffect(() => {
        console.log('From SongList, useEffect[songs]. stopLoading(). songs:', songs);
        stopLoading();
    }, [songs]);
*/
    useEffect(() => {
        if (search && (search.globalQuery || (search.specificQueries && Object.keys(search.specificQueries).length))) {
            console.log('From SongList, useEffect[JSON.stringify(search)]. search:', search, 'songs.length:', songs.length, '<< subscription >>');            
            const subscription = Meteor.subscribe('songs', search, function () {
                setSongs(Songs.find({}).fetch());
                console.log('From SongList, useEffect[JSON.stringify(search)], subscription callback. songs.length:', songs.length);            
                stopLoading();
            });         
            return () => {
                console.log('From SongList, useEffect. Stop subscription.');
                subscription.stop();
                setSongs([]);
            };
        } else {
            stopLoading();
        }
    }, [ , JSON.stringify(search)]);

    const handleSelect = song => () => {
        handleSelectSong(song);
    };

    const handleUnfold = songId => () => {
        setUnfoldedSong(songId);
    };
    
    return (
            <List component="nav" className={classes.root}>
                {/* loading ? <LinearProgress className={classes.progressBar} /> : '' */}
                {songs.length === 0 && !loading ?
                    !console.log('From SongList, return. No results.') && <SongListEmptyItem search={search} />
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
    /* songs: PropTypes.array.isRequired, */
    stopLoading: PropTypes.func.isRequired,
};
/* 
export default withTracker(props => {

    /* const search = Session.get('search'); */
    /* console.log('From SongList, withTracker. search:', search); */
/*
    return {
        songs: Songs.find({}).fetch(),
    };
})(SongList);
 */
export default SongList;
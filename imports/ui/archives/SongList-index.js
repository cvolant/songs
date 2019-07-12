import React, { createRef, useState, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { PropTypes } from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { makeStyles } from '@material-ui/core/styles';

import List from '@material-ui/core/List';

import { Songs } from '../../api/songs';
import SongListItem from './SongListItem';
import SongListEmptyItem from './SongListEmptyItem';

const nbItemsPerPage = 20;

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
    const { favoriteSongs, handleSelectSong, loading, meteorCall, search, smallDevice, stopLoading } = props;
    const [unfoldedSong, setUnfoldedSong] = useState(undefined);
    const classes = useStyles();
    const [songs, setSongs] = useState([]);
    const [filters, setFilters] = useState({ limit: nbItemsPerPage });
    const [limitRaised, setLimitRaised] = useState(false);
    const listRef = createRef();

    console.log('From SongList. render. props:', props, '\nfilters:', filters);

    useEffect(() => {
        if (search && (search.globalQuery || (search.specificQueries && Object.keys(search.specificQueries).length))) {
            console.log('From SongList, useEffect[JSON.stringify(search)]. search:', search, 'songs.length:', songs.length, '<< subscription >>');
            setLimitRaised(false);
/* 
            const subscriptions = [];
            Tracker.autorun(() => {
                subscriptions.push(Meteor.subscribe);
            });
 */
            const subscription = Meteor.subscribe('songs', { search, filters }, function () {
                const songs = Songs.find({}).fetch();
                setSongs(songs);
                console.log('From SongList, useEffect[JSON.stringify(search)], subscription callback. songs.length:', songs.length);
                stopLoading();
            });
            return () => {
                console.log('From SongList, useEffect. Stop subscription.');
                subscription.stop();
                setSongs([]);
            };
        } else {
            console.log('From Songlist, useEffect. empty search. stopLoading().');
            stopLoading();
        }
    }, [search, JSON.stringify(filters)]);
    useEffect(() => {
        const newFilters = filters;
        newFilters.limit = nbItemsPerPage;
        setFilters(newFilters);
    }, [search]);


    const handleSelect = song => () => {
        handleSelectSong(song);
    };

    const handleListScroll = () => {
        if (!limitRaised) {
        const list = listRef.current;
        const scrollPosition = list.scrollTop * 100 / list.scrollTopMax;
        if (scrollPosition > 90) {
            console.log('From SongList, useLayoutEffet. scrollPosition:', scrollPosition);
            const newFilters = filters;
            newFilters.limit += nbItemsPerPage;
            setLimitRaised(true);
            setFilters(newFilters);
            }
        }
    };
    const handleToggleFavorite = (songId, value) => () => {
        console.log('From SongList, handleToggleFavorite. songId:', songId);
        meteorCall('user.favorite.toggle', songId, value);
    };

    const handleUnfold = songId => () => {
        setUnfoldedSong(songId);
    };

    return (
        <List component="nav" className={classes.root} onScroll={handleListScroll} ref={listRef}>
            {songs.length === 0 && !loading ?
                !console.log('From SongList, return. No results.') && <SongListEmptyItem search={search} />
                :
                songs.map(song => {
                    const songId = song._id;
                    const favorite = favoriteSongs && favoriteSongs.indexOf(songId._str) != -1;
                    return (
                        <SongListItem
                            key={songId}
                            {...{ favorite, smallDevice, song }}
                            handleSelect={handleSelect(song)}
                            handleToggleFavorite={value => handleToggleFavorite(songId, value)}
                            handleUnfold={handleUnfold(songId)}
                            unfolded={unfoldedSong == songId}
                            displayFavorite={!!favoriteSongs}
                        />
                    );
                })
            }
        </List>
    );
};

SongList.propTypes = {
    favoriteSongs: PropTypes.array,
    handleSelectSong: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    meteorCall: PropTypes.func.isRequired,
    search: PropTypes.object,
    smallDevice: PropTypes.bool.isRequired,
    stopLoading: PropTypes.func.isRequired,
};

export default withTracker(props => {
    if (Meteor.userId()) Meteor.subscribe('Meteor.users.userSongs');
    const favoriteSongs = Meteor.user() && Meteor.user().userSongs && Meteor.user().userSongs.favoriteSongs;

    return {
        favoriteSongs,
        meteorCall: Meteor.call,
    };

    /*
        const search = Session.get('search');
        console.log('From SongList, withTracker. search:', search);
        return {
            songs: Songs.find({}).fetch(),
        };
    */
})(SongList);
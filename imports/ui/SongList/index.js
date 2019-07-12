import React, { createRef, useState, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { PropTypes } from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { makeStyles } from '@material-ui/core/styles';

import List from '@material-ui/core/List';

import { Songs } from '../../api/songs';
import SearchField from './../SongList/SearchField';
import SongListItem from './SongListItem';
import SongListItemLoading from './SongListItemLoading';
import SongListEmptyItem from './SongListEmptyItem';
import SongListSorting from './SongListSorting';

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
    const { favoriteSongs, handleFocus, handleSelectSong, logoMenuDeployed, meteorCall, smallDevice } = props;
    const listRef = createRef();

    const classes = useStyles();

    const [ displaySort,    setDisplaySort  ] = useState(true);
    const [ limit,          setLimit        ] = useState(nbItemsPerPage);
    const [ limitRaised,    setLimitRaised  ] = useState(false);
    const [ loading,        setLoading      ] = useState(false);
    const [ sort,           setSort         ] = useState();
    const [ search,         setSearch       ] = useState();
    const [ songs,          setSongs        ] = useState([]);
    const [ subscriptions,  setSubscriptions] = useState([]);
    const [ unfoldedSong,   setUnfoldedSong ] = useState();

    console.log('From SongList. render. props:', props, '\nsort:', sort, 'limit:', limit);

    const updateSubscription = () => {
        setLoading(true);
        const newSubscriptions = subscriptions;
        console.log('From SongList, updateSubscription. search:', { search, options: { limit, sort } });
        const newSubscription = Meteor.subscribe('songs', { search, options: { limit, sort } }, function () {
            const songs = Songs.find({}).fetch();
            setSongs(songs);
            console.log('From SongList, updateSubscription, subscription callback. songs.length:', songs.length);
            setLoading(false);
            setLimitRaised(false);
        });
        newSubscriptions.push(newSubscription);
        setSubscriptions(newSubscriptions);
        return () => {
            console.log('From SongList, updateSubscription return. Stop subscriptions.');
            subscriptions.forEach(subscription => subscription.stop());
            setSongs([]);
        };
    };

    useEffect(updateSubscription, [sort]);
    useEffect(() => {
        console.log('From SongList, useEffect[search].');
        setLimit(nbItemsPerPage);
        if (search && (search.globalQuery || (search.specificQueries && Object.keys(search.specificQueries).length))) {
            return updateSubscription();
        } else {
            console.log('From Songlist, useEffect. empty search. stopLoading().');
            setLoading(false);
        }
    }, [search]);

    const handleListScroll = () => {
        if (!limitRaised) {
            const list = listRef.current;
            const scrollPosition = list.scrollTop * 100 / list.scrollTopMax;
            if (scrollPosition > 90) {
                console.log('From SongList, useLayoutEffet. scrollPosition:', scrollPosition);
                setLimitRaised(true);
                setLimit(limit + nbItemsPerPage);
                updateSubscription();
            }
        }
    };
    const handleNewSearch = newSearch => {    
      console.log('From SearchPage, handleNewSearch. newSearch:', newSearch, 'search:', search);
      if (JSON.stringify(newSearch) != JSON.stringify(search)) {
          setLoading(true);
          setSearch(newSearch);
          console.log('From SearchPage, handleNewSearch. newSearch. loading:', loading, 'search:', search);
        }
    };
    const handleSort = sortCriterion => () => setSort({
        /* ...sort, // If a multicriteria sorting is needed. */
        [sortCriterion]: sort && sort[sortCriterion] ? (sort[sortCriterion] == -1 ? undefined : -1) : 1
    });
    const handleSelect = song => () => handleSelectSong(song);
    const handleToggleDisplaySort = open => () => setDisplaySort(open || !displaySort);
    const handleToggleFavorite = (songId, value) => () => {
        console.log('From SongList, handleToggleFavorite. songId:', songId);
        meteorCall('user.favorite.toggle', songId, value);
    };
    const handleUnfold = songId => () => setUnfoldedSong(songId);

    return (
        <React.Fragment>
            <SearchField {...{
                logoMenuDeployed,
                handleFocus,
                handleNewSearch,
                handleToggleDisplaySort,
                loading
            }}/>
            <List
                component="nav"
                className={classes.root}
                onScroll={handleListScroll}
                ref={listRef}
                subheader={displaySort && (songs.length > 0 || loading) &&
                    <SongListSorting {...{ handleToggleDisplaySort, handleSort, sort, smallDevice }}/>
                }
            >
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
                {limitRaised && <SongListItemLoading />}
            </List>
        </React.Fragment>
    );
};

SongList.propTypes = {
    favoriteSongs: PropTypes.array,
    handleFocus: PropTypes.func.isRequired,
    handleSelectSong: PropTypes.func.isRequired,
    logoMenuDeployed: PropTypes.bool,
    meteorCall: PropTypes.func.isRequired,
    smallDevice: PropTypes.bool.isRequired,
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
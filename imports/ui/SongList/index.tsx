import React, { createRef, useState, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';

import { Mongo } from 'meteor/mongo';
import SearchField, {
  ISearch, ISearchOptions, ISearchOptionSort, ISearchOptionSortValue,
} from './SearchField';
import SongListItem from './SongListItem';
import SongListItemLoading from './SongListItemLoading';
import SongListEmptyItem from './SongListEmptyItem';
import SongListSorting from './SongListSorting';

import { Songs, ISong } from '../../api/songs';
import { IUser } from '../../api/users';

const nbItemsPerPage = 20;

const useStyles = makeStyles(() => ({
  root: {
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    overflowScrolling: 'touch',
    width: '100%',
  },
}));

interface ISongListProps {
  handleFocus: (focus?: boolean) => () => void;
  handleSelectSong: (song: ISong) => void;
  logoMenuDeployed?: boolean;
  smallDevice: boolean;
}
interface ISongListWTData {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  meteorCall: (method: string, ...rest: any[]) => void;
  favoriteSongs: Mongo.ObjectID[];
  isAuthenticated: boolean;
}
interface IWrappedSongListProps
  extends ISongListProps, ISongListWTData { }

export const WrappedSongList: React.FC<IWrappedSongListProps> = ({
  favoriteSongs,
  handleFocus,
  handleSelectSong,
  isAuthenticated,
  logoMenuDeployed,
  meteorCall,
  smallDevice,
}) => {
  const listRef = createRef<HTMLElement>();

  const classes = useStyles();

  const [displaySort, setDisplaySort] = useState(false);
  const [limit, setLimit] = useState(nbItemsPerPage);
  const [limitRaised, setLimitRaised] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState<ISearchOptionSort | undefined>(undefined);
  const [search, setSearch] = useState();
  const [songs, setSongs] = useState<ISong[]>([]);
  const [subscriptions, setSubscriptions] = useState<Meteor.SubscriptionHandle[]>([]);
  const [unfoldedSong, setUnfoldedSong] = useState();

  console.log('From SongList. render. sort:', sort, 'limit:', limit);

  const updateSubscription = (): (() => void) => {
    setLoading(true);
    const newSubscriptions = subscriptions;
    const options: ISearchOptions = { limit, sort };
    console.log('From SongList, updateSubscription. search:', { search, options });
    const newSubscription = Meteor.subscribe('songs', { search, options }, () => {
      const updatedSongs = Songs.find({}).fetch() as ISong[];
      setSongs(updatedSongs);
      console.log('From SongList, updateSubscription, subscription callback. updatedSongs.length:', updatedSongs.length);
      setLoading(false);
      setLimitRaised(false);
    });
    newSubscriptions.push(newSubscription);
    setSubscriptions(newSubscriptions);
    return (): void => {
      console.log('From SongList, updateSubscription return. Stop subscriptions.');
      subscriptions.forEach((subscription) => subscription.stop());
      setSongs([]);
    };
  };

  useEffect(updateSubscription, [sort]);
  useEffect(() => {
    console.log('From SongList, useEffect[search]. listRef:', listRef);
    console.log('From SongList, useEffect[search].');
    setLimit(nbItemsPerPage);
    if (search
      && (search.globalQuery
        || (search.specificQueries && Object.keys(search.specificQueries).length)
      )
    ) {
      return updateSubscription();
    }
    console.log('From Songlist, useEffect. empty search. stopLoading().');
    setLoading(false);
    return (): void => {};
  }, [search]);

  const handleListScroll = (): void => {
    if (!limitRaised && listRef.current) {
      const {
        current: {
          scrollTop,
          scrollHeight,
          clientHeight,
        },
      } = listRef;
      const scrollPosition = (scrollTop * 100) / (scrollHeight - clientHeight);
      if (scrollPosition > 90) {
        console.log('From SongList, useLayoutEffet. scrollPosition:', scrollPosition);
        setLimitRaised(true);
        setLimit(limit + nbItemsPerPage);
        updateSubscription();
      }
    }
  };
  const handleNewSearch = (newSearch: ISearch): void => {
    console.log('From SearchPage, handleNewSearch. newSearch:', newSearch, 'search:', search);
    if (JSON.stringify(newSearch) !== JSON.stringify(search)) {
      setLoading(true);
      setSearch(newSearch);
      console.log('From SearchPage, handleNewSearch. newSearch. loading:', loading, 'search:', search);
    }
  };
  const handleSort = (sortCriterion: string) => (): void => {
    let sortValue: ISearchOptionSortValue;
    if (sort && sort[sortCriterion]) {
      sortValue = sort[sortCriterion] === -1 ? undefined : -1;
    } else {
      sortValue = 1;
    }
    setSort({
      /* ...sort, // If a multicriteria sorting is needed. */
      [sortCriterion]: sortValue,
    });
  };
  const handleSelect = (song: ISong) => (): void => handleSelectSong(song);
  const handleToggleDisplaySort = (open?: boolean) => (): void => {
    setSort(undefined);
    setDisplaySort(open || !displaySort);
  };
  const handleToggleFavorite = (songId: Mongo.ObjectID, value?: boolean) => (): void => {
    console.log('From SongList, handleToggleFavorite. songId:', songId);
    meteorCall('user.favorite.toggle', songId, value);
  };
  const handleUnfold = (songId: Mongo.ObjectID) => (): void => setUnfoldedSong(songId);

  return (
    <>
      <SearchField
        displaySort={displaySort}
        logoMenuDeployed={logoMenuDeployed || false}
        handleFocus={handleFocus}
        handleNewSearch={handleNewSearch}
        handleToggleDisplaySort={handleToggleDisplaySort}
        isAuthenticated={isAuthenticated}
        loading={loading}
      />
      <List
        component="nav"
        className={classes.root}
        onScroll={handleListScroll}
        ref={listRef}
        subheader={displaySort && (songs.length > 0 || loading)
          ? (
            <SongListSorting
              displayFavorite={isAuthenticated}
              handleToggleDisplaySort={handleToggleDisplaySort}
              handleSort={handleSort}
              sort={sort}
              smallDevice={smallDevice}
            />
          )
          : undefined}
      >
        {songs.length === 0 && !loading
          ? <SongListEmptyItem search={search} />
          : songs.map((song) => {
            const songId = song._id;
            const favorite = favoriteSongs
              ? favoriteSongs
                .map((favoriteSong) => favoriteSong.toHexString())
                .indexOf(songId.toHexString()) !== -1 : false;
            return (
              <SongListItem
                displayFavorite={isAuthenticated}
                favorite={favorite}
                handleSelect={handleSelect(song)}
                handleToggleFavorite={(value): (() => void) => handleToggleFavorite(songId, value)}
                handleUnfold={handleUnfold(songId)}
                smallDevice={smallDevice}
                song={song}
                unfolded={unfoldedSong === songId}
              />
            );
          })}
        {limitRaised && <SongListItemLoading />}
      </List>
    </>
  );
};

const SongList = withTracker<ISongListWTData, ISongListProps>(() => {
  const isAuthenticated = !!Meteor.userId();
  if (isAuthenticated) {
    Meteor.subscribe('Meteor.users.userSongs');
  }
  const user = Meteor.user() as IUser;
  const favoriteSongs = user && user.userSongs
    ? user.userSongs.favoriteSongs
    : [];

  return {
    favoriteSongs,
    isAuthenticated,
    meteorCall: Meteor.call,
  };
})(WrappedSongList);

export default SongList;

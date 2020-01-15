import { Meteor } from 'meteor/meteor';
import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';

import Loading from '../Loading';
import NotFound from '../NotFound';

import Broadcasts from '../../api/broadcasts/broadcasts';
import Songs from '../../api/songs/songs';

import Station from './Station';

interface IBroadcastFetcherProps {
  broadcastId: string;
}

export const BroadcastFetcher: React.FC<IBroadcastFetcherProps> = ({ broadcastId }) => {
  const [songNb, setSongNb] = useState();

  const broadcastLoading = useTracker(() => {
    // Note that this subscription will get cleaned up
    // when your component is unmounted or deps change.
    const handle = Meteor.subscribe('broadcast', broadcastId);
    return !handle.ready();
  }, [broadcastId]);

  const { broadcast } = useTracker(() => {
    const tBroadcast = Broadcasts.findOne({ 'addresses.id': broadcastId });
    return {
      broadcast: tBroadcast,
      status: tBroadcast ? tBroadcast.status : undefined,
      state: tBroadcast ? tBroadcast.state : {},
      broadcastTitle: (tBroadcast && tBroadcast.title) || '',
      ...tBroadcast ? tBroadcast.state : {},
    };
  }, [broadcastId]);

  const songs = useTracker(() => Songs.find({}).fetch(), []);

  if (broadcast && songNb === undefined) {
    setSongNb(broadcast.state.songNumber || 0);
  }

  if (!broadcastLoading && broadcast && songs) {
    console.log('From BroadcastFetcher, render. broadcast:', broadcast, 'songs:', songs);
    return <Station broadcast={broadcast} songs={songs} />;
  }
  if (broadcastLoading) {
    return <Loading />;
  }
  return <NotFound />;
};

export default BroadcastFetcher;
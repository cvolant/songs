import { Meteor } from 'meteor/meteor';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';

import Loading from '../Loading';
import { NotFoundPage } from '../NotFound';

import Broadcasts from '../../api/broadcasts/broadcasts';
import Songs from '../../api/songs/songs';

import Station from './Station';

export const BroadcastPage: React.FC = () => {
  const broadcastId = useParams<{ broadcastId: string }>();
  const [songNb, setSongNb] = useState<number | undefined>();

  const broadcastLoading = useTracker(() => {
    // Note that this subscription will get cleaned up
    // when your component is unmounted or deps change.
    const handle = Meteor.subscribe('broadcast', broadcastId);
    return !handle.ready();
  }, [broadcastId]);

  const uTBroadcastAndDetails = useTracker(() => {
    const tBroadcast = Broadcasts.findOne({ 'addresses.id': broadcastId });
    return {
      broadcast: tBroadcast,
      status: tBroadcast ? tBroadcast.status : undefined,
      state: tBroadcast ? tBroadcast.state : {},
      broadcastTitle: (tBroadcast && tBroadcast.title) || '',
      ...tBroadcast ? tBroadcast.state : {},
    };
  }, [broadcastId]);

  const { broadcast } = uTBroadcastAndDetails;

  const songIds = broadcast ? broadcast.songs.map((mapSong) => mapSong._id) : [];

  const songs = useTracker(
    () => (broadcast ? Songs.find({ _id: { $in: songIds } }).fetch() : []),
    [songIds.join('')],
  );

  if (broadcast && songNb === undefined) {
    setSongNb(broadcast.state.songNumber || 0);
  }

  if (!broadcastLoading && broadcast && songs) {
    // console.log('From BroadcastPage, render. broadcast:', broadcast, 'songs:', songs);
    return <Station broadcast={broadcast} songs={songs} />;
  }
  if (broadcastLoading) {
    return <Loading />;
  }
  return <NotFoundPage />;
};

export default BroadcastPage;

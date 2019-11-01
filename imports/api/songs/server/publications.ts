import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import {
  ISong, IMongoQueryOptions,
} from '../../../types';

import Songs from '../songs';

Meteor.publish('song', (_id: Mongo.ObjectID) => {
  console.log('From songs, publish song. _id:', _id);
  return Songs.find(_id);
});

Meteor.publish('songs', ({
  query, options,
}: {
  query: Mongo.Query<ISong>;
  options: IMongoQueryOptions;
}) => Songs.find(query, options as IMongoQueryOptions));

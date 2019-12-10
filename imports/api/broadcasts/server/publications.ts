import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Broadcasts } from '../broadcasts';

Meteor.publish('broadcast', (broadcastId: Mongo.ObjectID) => Broadcasts.find({ _id: broadcastId }));

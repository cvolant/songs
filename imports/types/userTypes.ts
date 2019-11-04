import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export interface IUser extends Meteor.User {
  favoriteSongs: Mongo.ObjectID[];
  folders: Mongo.ObjectID[];
  createdSongs: Mongo.ObjectID[];
  emails: Meteor.UserEmail[];
}

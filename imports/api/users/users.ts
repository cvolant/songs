import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import SimpleSchema from 'simpl-schema';

import { IUser } from '../../types';
import Songs from '../songs/songs';
import Folders from '../folders/folders';

export const validateNewUser = (user: IUser): boolean => {
  const { emails } = user;
  const email = emails[0].address;

  new SimpleSchema({
    email: {
      type: String,
      regEx: SimpleSchema.RegEx.Email,
    },
  }).validate({ email });

  return true;
};

if (Meteor.isServer) {
  Accounts.validateNewUser(validateNewUser);
  Accounts.onCreateUser((_options, user) => ({
    favoriteSongs: [],
    createdSongs: [],
    folders: [],
    ...user,
  }));
}

Meteor.users.helpers({
  getFavoriteSongs() {
    return Songs.find({ _id: { $in: this.favoriteSongs } });
  },
  getCreatedSongs() {
    return Songs.find({ _id: { $in: this.createdSongs } });
  },
  getFolders() {
    return Folders.find({ _id: { $in: this.folders } });
  },
});

export default validateNewUser;

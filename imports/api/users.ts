/* eslint-disable func-names */
import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { Accounts } from 'meteor/accounts-base';
import { Mongo } from 'meteor/mongo';

export interface IUser extends Meteor.User {
  userSongs: {
    favoriteSongs: Mongo.ObjectID[];
  };
  emails: Meteor.UserEmail[];
}

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
  Accounts.onCreateUser((options, user) => {
    const newUser = user;
    newUser.userSongs = {
      favoriteSongs: [],
    };
    return newUser;
  });

  Meteor.publish('Meteor.users.userSongs', () => {
    // Select only the users that match the array of IDs passed in
    const selector = {
      _id: Meteor.userId(),
    };

    // Only return one field, `initials`
    const options = {
      fields: { userSongs: 1 },
    };

    return Meteor.users.find(selector, options);
  });
}

Meteor.methods({
  'user.favorite.toggle': function (songId: Mongo.ObjectID, value): void {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    const { userSongs } = Meteor.users.findOne(this.userId) as IUser;
    const index = userSongs.favoriteSongs
      .map((favoriteSong) => favoriteSong.toHexString())
      .indexOf(songId.toHexString());
    console.log('From users, user.favorite.toggle. songId.toHexString():', songId.toHexString(), '\nvalue:', value, '\nindex:', index, '\nfavoriteSongs.map(favoriteSong => favoriteSong.toHexString()):', userSongs.favoriteSongs.map((favoriteSong) => favoriteSong.toHexString()));
    if (index < 0) {
      userSongs.favoriteSongs.push(songId);
    } else {
      userSongs.favoriteSongs.splice(index, 1);
    }

    Meteor.users.update(this.userId, {
      $set: {
        userSongs,
      },
    });
  },
});

export default validateNewUser;

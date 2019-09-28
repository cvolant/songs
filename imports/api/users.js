import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { Accounts } from 'meteor/accounts-base';

export const validateNewUser = (user) => {
  const email = user.emails[0].address;

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
  'user.favorite.toggle': function (songId, value) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    const { userSongs } = Meteor.users.findOne(this.userId);
    const index = userSongs.favoriteSongs
      .map((favoriteSong) => favoriteSong._str)
      .indexOf(songId._str);
    console.log('From users, user.favorite.toggle. songId._str:', songId._str, '\nvalue:', value, '\nindex:', index, '\nfavoriteSongs.map(favoriteSong => favoriteSong._str):', userSongs.favoriteSongs.map((favoriteSong) => favoriteSong._str));
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

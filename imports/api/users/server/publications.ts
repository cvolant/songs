import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { publishComposite } from 'meteor/reywood:publish-composite';

import { Folders } from '../../folders/folders';
import { IFolder, ISong, IUser } from '../../../types';
import Songs from '../../songs/songs';

publishComposite('user.folders', {
  find(): Mongo.Cursor<IFolder> {
    return Folders.find({ userId: this.userId });
  },

  children: [{
    find(folder: IFolder): Mongo.Cursor<ISong> {
      return Songs.find({ _id: { $in: folder.songs.map((song) => song._id) } });
    },
  }],
});

publishComposite('user.favoriteSongs', {
  find(): Mongo.Cursor<IUser> {
    return Meteor.users.find({ _id: this.userId }, { fields: { favoriteSongs: 1 } });
  },

  children: [{
    find(user: IUser): Mongo.Cursor<ISong> {
      return Songs.find({ _id: { $in: user.favoriteSongs } });
    },
  }],
});

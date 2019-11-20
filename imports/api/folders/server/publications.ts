import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Folders } from '../folders';

Meteor.publish('folder', function folder(folderId: Mongo.ObjectID) {
  return Folders.find(
    { _id: folderId, userId: this.userId },
    { fields: { sharedWith: 0 } },
  );
});

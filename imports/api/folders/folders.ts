import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { IFolder, FolderSchema } from '../../types/folderTypes';
import Songs from '../songs/songs';

class FoldersCollection extends Mongo.Collection<IFolder> {
  insert(doc: IFolder, callback?: Function | undefined): string {
    const ourDoc = doc;
    ourDoc.updatedAt = ourDoc.updatedAt || new Date();
    const result = super.insert(ourDoc, callback);
    console.log('From api.folders.inset. result:', result);
    return result;
  }

  update(selector: string | Mongo.Query<IFolder>, modifier: Mongo.Modifier<IFolder>): number {
    const result = super.update(selector, modifier);
    return result;
  }

  remove(selector: string | Mongo.Query<IFolder>): number {
    const result = super.remove(selector);
    return result;
  }
}

interface IFolderCollection extends Mongo.Collection<IFolder> {
  schema: SimpleSchema;
  attachSchema: (schema: SimpleSchema) => void;
  helpers: (args: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [name: string]: (this: IFolder) => any;
  }) => void;
}

export const Folders = new FoldersCollection('folders', { idGeneration: 'MONGO' }) as unknown as IFolderCollection;

Folders.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

Folders.schema = FolderSchema;

Folders.attachSchema(Folders.schema);

Folders.helpers({
  user() {
    return Meteor.users.findOne(this.userId);
  },
  getSongs() {
    return Songs.find({ _id: { $in: this.songs.map((song) => song._id) } });
  },
});

export default Folders;

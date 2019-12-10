import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { IFolder, FolderSchema } from '../../types/folderTypes';
import { ICollection } from '../../types';
import Songs from '../songs/songs';

class FoldersCollection extends Mongo.Collection<IFolder> {
  insert(doc: IFolder, callback?: Function | undefined): string {
    const ourDoc = doc;
    ourDoc.updatedAt = ourDoc.updatedAt || new Date();
    const result = super.insert(ourDoc, callback);
    console.log('From api.folders.insert. result:', result);
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

export const Folders = new FoldersCollection('folders', { idGeneration: 'MONGO' }) as unknown as ICollection<IFolder>;

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

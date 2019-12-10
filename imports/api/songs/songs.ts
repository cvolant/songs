import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { ISong, SongSchema } from '../../types/songTypes';
import { ICollection } from '../../types';

class SongsCollection extends Mongo.Collection<ISong> {
  insert(doc: ISong, callback?: Function): string {
    const ourDoc = doc;
    ourDoc.updatedAt = ourDoc.updatedAt || new Date();
    const result = super.insert(ourDoc, callback);
    console.log('From api.songs.insert. result:', result);
    return result;
    // /!\ result is not a string but an ObjectID!!!
  }

  update(selector: string | Mongo.Query<ISong>, modifier: Mongo.Modifier<ISong>): number {
    const result = super.update(selector, modifier);
    return result;
  }

  remove(selector: string | Mongo.Query<ISong>): number {
    const result = super.remove(selector);
    return result;
  }
}

export const Songs = new SongsCollection('songs', { idGeneration: 'MONGO' }) as unknown as ICollection<ISong>;

Songs.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

Songs.schema = SongSchema;

Songs.attachSchema(Songs.schema);

Songs.helpers({
  owner() {
    return Meteor.users.findOne(this.userId);
  },
});

export default Songs;

import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { ISong, SongSchema } from '../../types';

class SongsCollection extends Mongo.Collection<ISong> {
  insert(doc: ISong, callback?: Function): string {
    const ourDoc = doc;
    ourDoc.updatedAt = ourDoc.updatedAt || new Date();
    const result = super.insert(ourDoc, callback);
    console.log('From api.songs.inset. result:', result);
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

interface ISongCollection extends Mongo.Collection<ISong> {
  schema: SimpleSchema;
  attachSchema: (schema: SimpleSchema) => void;
  publicFields: Record<string, 1 | 0>;
  helpers: (args: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [name: string]: (this: ISong) => any;
  }) => void;
}

export const Songs = new SongsCollection('songs', { idGeneration: 'MONGO' }) as unknown as ISongCollection;

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

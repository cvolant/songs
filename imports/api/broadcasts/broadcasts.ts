import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { IBroadcast, BroadcastSchema } from '../../types/broadcastTypes';

class BroadcastsCollection extends Mongo.Collection<IBroadcast> {
  insert(doc: IBroadcast, callback?: Function | undefined): string {
    const ourDoc = doc;
    ourDoc.updatedAt = ourDoc.updatedAt || new Date();
    const result = super.insert(ourDoc, callback);
    console.log('From api.broadcasts.insert. result:', result);
    return result;
  }

  update(selector: string | Mongo.Query<IBroadcast>, modifier: Mongo.Modifier<IBroadcast>): number {
    const result = super.update(selector, modifier);
    return result;
  }

  remove(selector: string | Mongo.Query<IBroadcast>): number {
    const result = super.remove(selector);
    return result;
  }
}

interface IBroadcastCollection extends Mongo.Collection<IBroadcast> {
  schema: SimpleSchema;
  attachSchema: (schema: SimpleSchema) => void;
  helpers: (args: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [name: string]: (this: IBroadcast) => any;
  }) => void;
}

export const Broadcasts = new BroadcastsCollection('broadcasts', { idGeneration: 'MONGO' }) as unknown as IBroadcastCollection;

Broadcasts.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

Broadcasts.schema = BroadcastSchema;

Broadcasts.attachSchema(Broadcasts.schema);

Broadcasts.helpers({
});

export default Broadcasts;

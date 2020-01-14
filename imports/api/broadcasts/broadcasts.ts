import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

import { IBroadcast, BroadcastSchema } from '../../types/broadcastTypes';

class BroadcastsCollection extends Mongo.Collection<IBroadcast> {
  insert(doc: Mongo.OptionalId<IBroadcast>, callback?: Function): string {
    const ourDoc = {
      updatedAt: new Date(),
      ...doc,
    };
    const result = super.insert(ourDoc, callback);
    console.log('From api.broadcasts.insert. result:', result);
    return result;
    // /!\ result is not a string but an ObjectID!!!
  }

  update(selector: string | Mongo.Query<IBroadcast>, modifier: Mongo.Modifier<IBroadcast>): number {
    const result = super.update(selector, modifier);
    return result;
  }

  remove(selector: string | Mongo.Query<IBroadcast>): number {
    const result = super.remove(selector);
    return result;
  }

  /* conditionalFields(
    selector: string | Mongo.Query<IBroadcast>,
    options: {
      fields: [
        Mongo.Query<IBroadcast>,
        Mongo.FieldSpecifier,
        Mongo.FieldSpecifier,
      ];
    },
  ): Mongo.Cursor<IBroadcast> {
    return this.find(
      selector,
      {
        ...options,
        fields: options.fields[0] ? options.fields[1] : options.fields[2],
      },
    );
  } */
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

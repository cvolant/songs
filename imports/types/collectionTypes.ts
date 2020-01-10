import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const ObjectIDSchema = new SimpleSchema({ _str: String });

export interface ICollection<T> extends Mongo.Collection<T> {
  schema: SimpleSchema;
  attachSchema: (schema: SimpleSchema) => void;
  helpers: (args: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [name: string]: (this: T) => any;
  }) => void;
}

export type IUnfetched<T> = Partial<T> & {
  _id: Mongo.ObjectID;
}

export default ObjectIDSchema;

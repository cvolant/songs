import { Mongo } from 'meteor/mongo';
import { DDPCommon } from 'meteor/ddp';
import SimpleSchema from 'simpl-schema';

export const ObjectIDSchema = new SimpleSchema({ _str: String });
export interface IMethodInvocation extends DDPCommon.MethodInvocation {
  userId?: string;
}

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

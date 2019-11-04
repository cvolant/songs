import { DDPCommon } from 'meteor/ddp';
import SimpleSchema from 'simpl-schema';

export const ObjectIDSchema = new SimpleSchema({ _str: String });
export interface IMethodInvocation extends DDPCommon.MethodInvocation {
  userId?: string;
}

export default ObjectIDSchema;

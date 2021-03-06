/*
Trying to get types for ValidatedMethod...
Attempt on 2019/10/22
Source: https://github.com/nicu-chiciuc/typed-meteor-methods/blob/master/imports/methodTypes.d.ts
 */

import { Meteor } from 'meteor/meteor';
import { KnownMethods } from '../imports/types/methodTypes';

declare module 'meteor/meteor' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type FirstArgument<T> = T extends (val: infer R) => any ? R : never;

  // eslint-disable-next-line no-shadow
  namespace Meteor {
    function call<K extends keyof KnownMethods = keyof KnownMethods>(
      methodName: K,
      arg: FirstArgument<KnownMethods[K]>
    ): ReturnType<KnownMethods[K]>;

    function call<K extends keyof KnownMethods = keyof KnownMethods>(
      methodName: K,
      arg: FirstArgument<KnownMethods[K]>,
      callback: (error: Meteor.Error, data: ReturnType<KnownMethods[K]>) => void
    ): void;
  }
}

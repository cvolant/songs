/*
Trying to get types for ValidatedMethod...
Attempt on 2019/10/22
Source: https://github.com/nicu-chiciuc/typed-meteor-methods/blob/master/imports/methodTypes.d.ts
 */

import {
  ValidatedMethod,
  ValidatedMethodAsFunc,
} from 'meteor/mdg:validated-method';
import {
  insert,
  updateNewSong,
  updateRemoveSong,
  remove,
} from './api/folders/methods';

export type KnownMethods = ValidatedMethodAsFunc<typeof insert>
& ValidatedMethodAsFunc<typeof updateNewSong>
& ValidatedMethodAsFunc<typeof updateRemoveSong>
& ValidatedMethodAsFunc<typeof remove>;

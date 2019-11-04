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
  update as updateFolder,
  updateInsertSong,
  updateRemoveSong,
  updateUpdateSong,
} from '../api/folders/methods';
import {
  update as updateSong,
} from '../api/songs/methods';
import {
  toggleFavorite,
  insertCreatedSong,
  removeCreatedSong,
  insertFolder,
  removeFolder,
} from '../api/users/methods';

export type KnownMethods = ValidatedMethodAsFunc<typeof updateFolder>
& ValidatedMethodAsFunc<typeof updateInsertSong>
& ValidatedMethodAsFunc<typeof updateRemoveSong>
& ValidatedMethodAsFunc<typeof updateUpdateSong>
& ValidatedMethodAsFunc<typeof updateSong>
& ValidatedMethodAsFunc<typeof toggleFavorite>
& ValidatedMethodAsFunc<typeof insertCreatedSong>
& ValidatedMethodAsFunc<typeof removeCreatedSong>
& ValidatedMethodAsFunc<typeof insertFolder>
& ValidatedMethodAsFunc<typeof removeFolder>;

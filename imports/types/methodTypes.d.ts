/*
Trying to get types for ValidatedMethod...
Attempt on 2019/10/22
Source: https://github.com/nicu-chiciuc/typed-meteor-methods/blob/master/imports/methodTypes.d.ts
 */

import {
  ValidatedMethodAsFunc,
} from 'meteor/mdg:validated-method';
import {
  foldersUpdate,
  foldersUpdateSongsInsert,
  foldersUpdateSongsRemove,
  foldersUpdateSongsUpdate,
} from '../api/folders/methods';
import {
  songsInsert,
  songsUpdate,
  songsRemove,
} from '../api/songs/methods';
import {
  userFavoriteToggle,
  userCreatedSongInsert,
  userCreatedSongRemove,
  userFoldersInsert,
  userFoldersRemove,
} from '../api/users/methods';

export type KnownMethods = ValidatedMethodAsFunc<typeof foldersUpdate>
& ValidatedMethodAsFunc<typeof foldersUpdateSongsInsert>
& ValidatedMethodAsFunc<typeof foldersUpdateSongsRemove>
& ValidatedMethodAsFunc<typeof foldersUpdateSongsUpdate>
& ValidatedMethodAsFunc<typeof songsInsert>
& ValidatedMethodAsFunc<typeof songsUpdate>
& ValidatedMethodAsFunc<typeof songsRemove>
& ValidatedMethodAsFunc<typeof userFavoriteToggle>
& ValidatedMethodAsFunc<typeof userCreatedSongInsert>
& ValidatedMethodAsFunc<typeof userCreatedSongRemove>
& ValidatedMethodAsFunc<typeof userFoldersInsert>
& ValidatedMethodAsFunc<typeof userFoldersRemove>;

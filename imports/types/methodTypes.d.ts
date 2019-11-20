/*
Trying to get types for ValidatedMethod...
Attempt on 2019/10/22
Source: https://github.com/nicu-chiciuc/typed-meteor-methods/blob/master/imports/methodTypes.d.ts
 */

import {
  ValidatedMethodAsFunc,
} from 'meteor/mdg:validated-method';
import {
  folderUpdate,
  folderUpdateInsertSong,
  folderUpdateRemoveSong,
  folderUpdateUpdateSong,
} from '../api/folders/methods';
import {
  songUpdate,
} from '../api/songs/methods';
import {
  userToggleFavorite,
  userInsertCreatedSong,
  userRemoveCreatedSong,
  userInsertFolder,
  userRemoveFolder,
} from '../api/users/methods';

export type KnownMethods = ValidatedMethodAsFunc<typeof folderUpdate>
& ValidatedMethodAsFunc<typeof folderUpdateInsertSong>
& ValidatedMethodAsFunc<typeof folderUpdateRemoveSong>
& ValidatedMethodAsFunc<typeof folderUpdateUpdateSong>
& ValidatedMethodAsFunc<typeof songUpdate>
& ValidatedMethodAsFunc<typeof userToggleFavorite>
& ValidatedMethodAsFunc<typeof userInsertCreatedSong>
& ValidatedMethodAsFunc<typeof userRemoveCreatedSong>
& ValidatedMethodAsFunc<typeof userInsertFolder>
& ValidatedMethodAsFunc<typeof userRemoveFolder>;

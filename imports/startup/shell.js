import '../api/folders/folders';
import '../api/folders/methods';
import '../api/folders/server/publications';
import '../api/songs/songs';
import '../api/songs/methods';
import '../api/songs/server/publications';
import '../api/users/users';
import '../api/users/methods';
import '../api/users/server/publications';

/*

meteor shell
import Songs from './imports/api/songs/songs.ts'

/!\ Import path from the root
/!\ It does not work without the file extension

Remark:
From the client, in developper tools, use require syntax:
Songs = require('./imports/api/songs/songs.ts').Songs

*/

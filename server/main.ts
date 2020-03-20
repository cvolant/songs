// Setup collections
import '../imports/api/users/methods';
import '../imports/api/users/server/publications';
import '../imports/api/songs/methods';
import '../imports/api/songs/server/publications';
import '../imports/api/folders/methods';
import '../imports/api/folders/server/publications';
import '../imports/api/broadcasts/methods';
import '../imports/api/broadcasts/broadcasts';
import '../imports/api/broadcasts/server/publications';

// Configure simple-schema
import '../imports/startup/simple-schema-configuration';

// eslint-disable-next-line global-require,  no-constant-condition
if (false) require('./../imports/startup/shell');

/*
import { Meteor } from 'meteor/meteor';
Meteor.startup(() => {
});
 */

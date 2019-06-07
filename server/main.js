import { Meteor } from "meteor/meteor";

import "../imports/api/users";
import "../imports/api/songs";
import "../imports/startup/simple-schema-configuration.js";
import { Songs } from "../imports/api/songs";

Meteor.startup(() => {
    console.log('Titre before:', Songs.findOne({numero: 16559}).titre);
    Songs.update({numero: 16559}, {
        $set: { titre: 'Donne-moi ton regard' }
    });
    console.log('Titre after:', Songs.findOne({numero: 16559}).titre);
});
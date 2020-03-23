/******************************************* 
Use the following commands in the terminal (in the app folder) to process this file:
meteor mongo
load('../../Technique/Chants/Traitement/ewowa.js')

To get the output in a file, use this single command instead:
echo "/*" > .db/output.js ; mongo mongodb://127.0.0.1:3001/meteor .db/processing.js >> .db/output.js
If it doesn't work, get a valid mongodb url:
meteor mongo --url
Then use this command below to close the comments in the output:  */
// print('*/\n');
/*


*******************************************/

nbSongsToSkip = 0;
nbSongsToProcess = 10000;
pathToFolder = '/home/corentin/Dropbox/Professionnel\ et\ associatif/Entrepreneuriat/Générateur\ de\ livret\ de\ célébration/Réalisation/songs/.db/';


/* UTILITIES */
comment = { log: (...args) => print('// ' + args.join(', ')) }
printArray = (name, array, transformation) => {
  print('\n');
  print(`const ${name} = [`);
  array.forEach(element => print(`  "${transformation ? transformation(element) : element}",`));
  print('];');
};


/* INITIALISATION */
// print('*/\n');

load('.db/slugify.js');

var songs = db.songs.find({}).skip(nbSongsToSkip).limit(nbSongsToProcess);

songs.forEach((song) => {
  const findExisting = (s) => db.songs.findOne({
    _id: { $ne: song._id },
    slug: s,
  });

  const baseSlug = `${slugify(song.compositor)}/${slugify(song.title)}`;
  let slug = baseSlug;
  let nbExisting = 1;
  let existing = findExisting(slug);

  while (existing && nbExisting < 50) {
    nbExisting++;
    slug = `${baseSlug}-${nbExisting}`;
    existing = findExisting(slug);
  }
  db.songs.updateOne({ _id: song._id }, { $set: { slug } })
});

/* 
comment.log('Drop former nSongs DB...');
db.nSongs && db.nSongs.drop();
comment.log('    Done.');

comment.log(`Copy ${nbSongsToCopy ? nbSongsToCopy : 'all'} songs from rawSongs DB to nSongs (${nbSongsToSkip} skipped)...`);
db.songs.find({}).skip(nbSongsToSkip).limit(nbSongsToCopy).forEach(song => db.nSongs.insertOne(song));
const nbSongs = db.nSongs.find({}).count();
comment.log(`    Done: ${db.nSongs.find({}).count()} songs copied to nSongs.`);
 */

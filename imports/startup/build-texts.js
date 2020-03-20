/**
 * This cannot be used with i18next-xhr-backend
 * since one cannot write in public folder while running.
 * This could be used with i18next-node-fs-backend,
 * using private folder instead of public folder
 * but i18next-node-fs-backend does not work...
 * */

import { readdir, readFile, writeFileSync } from 'fs';

const TEXT_ASSETS_PATH = 'assets/app/texts/';
const BUILT_TEXTS_DESTINATION = 'assets/app/i18n/locales/';

console.log('From build-texts');

const readError = (err, name) => {
  console.log('\nError while trying to read', name, '\nerr:', err);
};

const readFiles = (dirname, onFileName, onError) => {
  readdir(dirname, { withFileTypes: true }, (err, files) => {
    if (err) {
      readError(err, dirname);
      return;
    }
    files.forEach(onFileName);
  });
};

readdir('../web.browser/app', (err, files) => {
  console.log("Files in '../web.browser/app':", files);
});

const onFileContent = (folderName, fileName, content) => {
  const language = fileName.substr(0, 2);
  console.log(`Reading page "${folderName}" in ${language}...`);
  const newLocation = `${BUILT_TEXTS_DESTINATION + language}/texts.json`;
  const contentJs = { content: content.split('\n') };
  readFile(
    newLocation,
    'utf-8',
    (err, previousContentJSON) => {
      console.log('Reading existing file "texts" in', language, '...');
      const newContent = {
        ...err ? {} : JSON.parse(previousContentJSON),
        [folderName]: contentJs,
      };
      const newContentJSON = JSON.stringify(newContent, null, 2);
      console.log(`Writing new "${folderName}" content in ${language}...`);
      writeFileSync(newLocation, newContentJSON);
      console.log(`Done: new "${folderName}" content in ${language} written.`);
    },
  );
};

readFiles(TEXT_ASSETS_PATH, (file) => {
  if (file.isDirectory()) {
    readFiles(TEXT_ASSETS_PATH + file.name, (subfile) => {
      if (subfile.isFile()) {
        console.log(subfile.name);
        const subfilePath = `${TEXT_ASSETS_PATH + file.name}/${subfile.name}`;
        readFile(
          subfilePath,
          'utf-8',
          (err, content) => {
            if (err) {
              readError(err, subfilePath);
            }
            onFileContent(file.name, subfile.name, content);
          },
        );
      }
    });
  }
});

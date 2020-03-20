/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-var-requires */

const { readdir, readFile, writeFileSync } = require('fs');

const readFiles = (dirname, onFileName, onError) => {
  readdir(dirname, (err, filenames) => {
    if (err) {
      onError(err);
      return;
    }
    filenames.forEach(onFileName);
  });
};

const onError = (err, name) => {
  console.log('\nError while trying to read', name, '\nerr:', err);
};
const onFileContent = (folderName, fileName, content) => {
  const language = fileName.substr(0, 2);
  console.log(`Reading page "${folderName}" in ${language}...`);
  const newLocation = `./public/i18n/locales/${language}/texts.json`;
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

readFiles(
  __dirname,
  (subFolderName) => {
    if (subFolderName !== 'textsToJSON.js') {
      const subFolderPath = `${__dirname}/${subFolderName}`;
      readFiles(
        subFolderPath,
        (fileName) => {
          const filePath = `${subFolderPath}/${fileName}`;
          readFile(
            filePath,
            'utf-8',
            (err, content) => {
              if (err) {
                onError(err, fileName);
              }
              onFileContent(subFolderName, fileName, content);
            },
          );
        },
        (err) => {
          if (err) {
            onError(err, __dirname);
          }
        },
      );
    }
  },
  onError,
);

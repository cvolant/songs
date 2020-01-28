const fs = require('fs');

const readFiles = (dirname, onFileName, onError) => {
  fs.readdir(dirname, (err, filenames) => {
    if (err) {
      onError(err);
      return;
    }
    filenames.forEach(onFileName);
  });
};

const dirPath = './texts';
const onError = (err, name) => {
  console.log('\nError while trying to read', name, '\nerr:', err);
};
const onFileContent = (dirName, fileName, content) => {
  const language = fileName.substr(0, 2);
  console.log(`Reading page "${dirName}" in ${language}...`);
  const newLocation = `./public/i18n/locales/${language}/texts.json`;
  const contentJs = { content: content.split('\n') };
  fs.readFile(
    newLocation,
    'utf-8',
    (err, previousContentJSON) => {
      console.log('Reading existing file "texts" in', language, '...');
      const newContent = {
        ...err ? {} : JSON.parse(previousContentJSON),
        [dirName]: contentJs,
      };
      const newContentJSON = JSON.stringify(newContent, null, 2);
      console.log(`Writing new "${dirName}" content in ${language}...`);
      fs.writeFileSync(newLocation, newContentJSON);
      console.log(`Done: new "${dirName}" content in ${language} written.`);
    },
  );
};

readFiles(
  dirPath,
  (subDirName) => {
    if (subDirName !== 'textsToJSON.js') {
      const subDirPath = `${dirPath}/${subDirName}`;
      readFiles(
        subDirPath,
        (fileName) => {
          const filePath = `${subDirPath}/${fileName}`;
          fs.readFile(
            filePath,
            'utf-8',
            (err, content) => {
              if (err) {
                onError(err, fileName);
              }
              onFileContent(subDirName, fileName, content);
            },
          );
        },
        (err) => {
          if (err) {
            onError(err, dirPath);
          }
        },
      );
    }
  },
  onError,
);

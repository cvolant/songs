const webpack = require('webpack');
const rootPath = '/home/corentin/Dropbox/Professionnel et associatif/Entrepreneuriat/Générateur de livret de célébration/Réalisation/songs';

module.exports = ({ config }) => {
  config.plugins.push(
    new webpack.ProvidePlugin({
      // mock global variables
      'Accounts': rootPath + '/.storybook/mocks/Accounts',
      'Folders':  rootPath + '/.storybook/mocks/Folders',
      'Meteor':   rootPath + '/.storybook/mocks/Meteor',
      'Mongo':    rootPath + '/.storybook/mocks/Mongo',
      'Session':  rootPath + '/.storybook/mocks/Session',
      'Songs':    rootPath + '/.storybook/mocks/Songs',
      'WT':       rootPath + '/.storybook/mocks/withTracker',
    })
  );
  config.module.rules.push({
    test: /\.tsx?$/,
    use: [
      {
        loader: require('path').resolve('./.storybook/loaders/scrap-meteor-loader'),
      },
      {
        loader: require.resolve("babel-loader"),
        options: {
          presets: [require.resolve("babel-preset-react-app")]
        }
      },
      require.resolve("react-docgen-typescript-loader")
    ]
  });

  config.resolve.extensions.push(".ts", ".tsx");

  return config;
};
const webpack = require('webpack');

module.exports = ({ config }) => {
  config.plugins.push(
    new webpack.ProvidePlugin({
      // mock global variables
      'Meteor': '../../../.storybook/mocks/Meteor',
      'Mongo': '../../../.storybook/mocks/Mongo',
      'Songs': '../../../.storybook/mocks/Songs',
    })
  )
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
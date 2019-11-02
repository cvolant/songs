/* 
import { configure, addDecorator } from "@storybook/react";
import { withInfo } from "@storybook/addon-info";

// automatically import all files ending in *.stories.tsx
const req = require.context("../imports", true, /.stories.tsx$/);

function loadStories() {
  addDecorator(withInfo);
  req.keys().forEach(req);
}

configure(loadStories, module); */

import React, { Suspense } from 'react';
import { configure, addDecorator, addParameters } from '@storybook/react';
import '@storybook/addon-console';
import { themes } from '@storybook/theming';
import { withI18next } from 'storybook-addon-i18next';
import { muiTheme } from 'storybook-addon-material-ui';
import { setConsoleOptions } from '@storybook/addon-console';
import theme from '../imports/client/theme';
import i18n from '../imports/i18n';

setConsoleOptions({
  panelInclude: [/-SbMock-/],
});
addParameters({
  options: {
    theme: themes.dark,
  },
});
addDecorator(
  withI18next({
    i18n,
    languages: {
      en: 'English',
      fr: 'Français',
    },
  })
);
addDecorator((story, context) => (
  <Suspense fallback="Loading...">{story(context)}</Suspense>
));
addDecorator(muiTheme(theme));

configure(require.context('../stories', true, /\.stories\.tsx?$/), module)
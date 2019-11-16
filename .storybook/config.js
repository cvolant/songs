import React, { Suspense } from 'react';
import { configure, addDecorator, addParameters } from '@storybook/react';
import '@storybook/addon-console';
import { themes } from '@storybook/theming';
import { withI18next } from 'storybook-addon-i18next';
import { muiTheme } from 'storybook-addon-material-ui';
import { setConsoleOptions } from '@storybook/addon-console';
import theme from '../imports/client/theme';
import i18n from '../imports/i18n';

import { DeviceSizeProvider } from '../imports/state-contexts/app-device-size-context';

setConsoleOptions({
  panelInclude: [/-SbMock-/],
});
addParameters({
  options: {
    theme: themes.dark,
  },
  backgrounds: [
    { name: 'default', value: theme.palette.background.default, default: true },
    { name: 'page', value: theme.palette.background.page },
    { name: 'paper', value: theme.palette.background.paper },
  ],
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
  <Suspense fallback="Loading...">
    <DeviceSizeProvider>
      {story(context)}
    </DeviceSizeProvider>
  </Suspense>
));
addDecorator(muiTheme(theme));

configure(require.context('../stories', true, /\.stories\.tsx?$/), module)
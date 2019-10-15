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

import { configure, addDecorator } from '@storybook/react'

import { muiTheme } from 'storybook-addon-material-ui';
import theme from '../imports/client/theme';

addDecorator(muiTheme(theme));

configure(require.context('../imports', true, /\.stories\.tsx?$/), module)
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { action } from '@storybook/addon-actions';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  withKnobs, boolean, number,
} from '@storybook/addon-knobs';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Sync from '@material-ui/icons/Sync';

import Logo from '../imports/ui/LogoMenu/Logo';
import {
  LanguagePicker,
  TopMenuContent,
  TopMenuLarge,
  TopMenuSmall,
} from '../imports/ui/LogoMenu';
import LogoMenu, { WrappedLogoMenu, ILogoMenuMiddleButtonProp } from '../imports/ui/LogoMenu/LogoMenu';

export default {
  title: 'LogoMenu',
  decorators: [
    withKnobs,
    (storyFn: () => JSX.Element): JSX.Element => (
      <Router>
        <Route>
          {storyFn()}
        </Route>
      </Router>
    ),
  ],
};

export const languagePicker = (): JSX.Element => (
  <LanguagePicker />
);

export const topMenuContent = (): JSX.Element => (
  <TopMenuContent
    handleLogout={action('handleLogout')}
    handleToggleTopMenu={(deploy?: boolean): () => void => action(`handleToggleTopMenu(display: ${deploy})`)}
    isAuthenticated={boolean('isAuthenticated', true)}
  />
);

export const topMenuLarge = (): JSX.Element => (
  <TopMenuLarge
    PaperProps={{ style: { background: 'darkred' } }}
    topMenuIsOpen={boolean('topMenuIsOpen', true)}
  >
    <TopMenuContent
      handleLogout={action('handleLogout')}
      handleToggleTopMenu={(deploy?: boolean): () => void => action(`handleToggleTopMenu(display: ${deploy})`)}
      isAuthenticated={boolean('isAuthenticated', true)}
    />
  </TopMenuLarge>
);

export const topMenuSmall = (): JSX.Element => (
  <TopMenuSmall
    handleToggleTopMenu={(deploy?: boolean): () => void => action(`handleToggleTopMenu(display: ${deploy})`)}
    PaperProps={{ style: { background: 'darkred' } }}
    topMenuIsOpen={boolean('topMenuIsOpen', true)}
  >
    <TopMenuContent
      handleLogout={action('handleLogout')}
      handleToggleTopMenu={(deploy?: boolean): () => void => action(`handleToggleTopMenu(display: ${deploy})`)}
      isAuthenticated={boolean('isAuthenticated', true)}
    />
  </TopMenuSmall>
);

export const logo = (): JSX.Element => (
  <Logo />
);

export const wrappedLogoMenu = (): JSX.Element => (
  <WrappedLogoMenu
    handleToggleLogoMenu={(deploy?: boolean): () => void => action(`handleToggleLogoMenu(display: ${deploy})`)}
    handleToggleTutorial={(open?: boolean): () => void => action(`handleToggleTutorial(display: ${open})`)}
    logoMenuDeployed={boolean('logoMenuDeployed', true)}
    showTutorial={boolean('showTutorial', true)}
    tutorialAvailable={boolean('tutorialAvailable', true)}
    isAuthenticated={boolean('isAuthenticated', true)}
    handleLogout={action('handleLogout')}
  />
);

export const logoMenu = (): JSX.Element => (
  <LogoMenu
    middleButton={[
      'home',
      'dashboard',
      {
        ariaLabel: 'Pouet',
        Icon: Sync,
        to: '/en/pouet',
      },
    ][number("0: 'home'; 1: 'dashboard'; 2: Custom", 0, { min: 0, max: 2 })] as ILogoMenuMiddleButtonProp}
    handleToggleLogoMenu={boolean('handleToggleLogoMenu defined?', false) ? (deploy?: boolean): () => void => action(`handleToggleLogoMenu(display: ${deploy})`) : undefined}
    handleToggleTutorial={(open?: boolean): () => void => action(`handleToggleTutorial(display: ${open})`)}
    logoMenuDeployed={boolean('logoMenuDeployed defined?', false) ? boolean('logoMenuDeployed', true) : undefined}
    showTutorial={boolean('showTutorial', true)}
    tutorialAvailable={boolean('tutorialAvailable', true)}
  />
);

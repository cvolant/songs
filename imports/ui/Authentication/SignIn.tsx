import React from 'react';
import { useTranslation } from 'react-i18next';
import Door from './Door';

import routesPaths, { locales } from '../../routes/routesPaths';

export const SignIn: React.FC<{}> = () => {
  const { t, i18n: { language } } = useTranslation();
  return (
    <Door
      link={{ path: routesPaths.path(locales[language], 'signup'), text: t('register.Need an account', 'Need an account?') }}
      title={t('Sign in')}
      alreadySignedUp
    />
  );
};

export default SignIn;

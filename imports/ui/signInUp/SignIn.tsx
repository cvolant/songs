import React from 'react';
import { useTranslation } from 'react-i18next';
import Door from './Door';

import routesPaths, { locales } from '../../app/routesPaths';

export const SignIn: React.FC<{}> = () => {
  const { t, i18n: { language } } = useTranslation();
  return (
    <Door
      link={{ path: routesPaths.translatePath('/en/signup', locales[language]), text: t('register.Need an account', 'Need an account?') }}
      title={t('Sign in')}
      alreadySignedUp
    />
  );
};

export default SignIn;

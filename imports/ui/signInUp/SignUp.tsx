import React from 'react';
import { useTranslation } from 'react-i18next';
import Door from './Door';

import routesPaths, { locales } from '../../app/routesPaths';

export const SignUp: React.FC<{}> = () => {
  const { t, i18n: { language } } = useTranslation();
  return (
    <Door
      link={{ path: routesPaths.path(locales[language], 'signup'), text: t('register.Already have an account', 'Already have an account?') }}
      title={t('Sign up')}
      alreadySignedUp={false}
    />
  );
};

export default SignUp;

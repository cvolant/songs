import React from 'react';
import { useTranslation } from 'react-i18next';
import Door from './Door';

import { getPath } from '../../routes';

export const SignInPage: React.FC = () => {
  const { t, i18n: { language } } = useTranslation();
  return (
    <Door
      link={{
        path: getPath(language, 'signup'),
        text: t('register.Need an account', 'Need an account?'),
      }}
      title={t('Sign in')}
      alreadySignedUp
    />
  );
};

export default SignInPage;

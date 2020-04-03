import React from 'react';
import { useTranslation } from 'react-i18next';
import Door from './Door';

import usePath from '../../hooks/usePath';

export const SignInPage: React.FC = () => {
  const { t } = useTranslation();
  const { path } = usePath();

  return (
    <Door
      link={{
        path: path('signup'),
        text: t('register.Need an account', 'Need an account?'),
      }}
      title={t('Sign in')}
      alreadySignedUp
    />
  );
};

export default SignInPage;

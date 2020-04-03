import React from 'react';
import { useTranslation } from 'react-i18next';
import Door from './Door';

import usePath from '../../hooks/usePath';

export const SignUpPage: React.FC = () => {
  const { t } = useTranslation();
  const { path } = usePath();

  return (
    <Door
      link={{ path: path('signup'), text: t('register.Already have an account', 'Already have an account?') }}
      title={t('Sign up')}
      alreadySignedUp={false}
    />
  );
};

export default SignUpPage;

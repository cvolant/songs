import React from 'react';
import { useTranslation } from 'react-i18next';
import Door from './Door';

import { getPath } from '../../routes';

export const SignUpPage: React.FC = () => {
  const { t, i18n: { language } } = useTranslation();
  return (
    <Door
      link={{ path: getPath(language, 'signup'), text: t('register.Already have an account', 'Already have an account?') }}
      title={t('Sign up')}
      alreadySignedUp={false}
    />
  );
};

export default SignUpPage;

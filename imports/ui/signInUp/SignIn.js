import React from 'react';
import { useTranslation } from 'react-i18next';
import Door from './Door';

export default SignIn = () => {
    const { t } = useTranslation();
    return (
        <Door
            link={{ path: '/signup', text: t('register.Need an account', 'Need an account?') }}
            title={t('Sign in')}
            alreadySignedUp={true}
        />
    );
}
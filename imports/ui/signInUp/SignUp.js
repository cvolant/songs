import React from 'react';
import { useTranslation } from 'react-i18next';
import Door from './Door';

export default SignUp = () => {
    const { t } = useTranslation();
    return (
        <Door
            link={{ path: '/signin', text: t('Already have an account', 'Already have an account?') }}
            title={t('Sign up')}
            alreadySignedUp={false}
        />
    );
}
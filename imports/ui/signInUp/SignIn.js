import React from 'react';
import { useTranslation } from 'react-i18next';
import Door from './Door';

import routesPaths from '../../app/routesPaths';

export default SignIn = () => {
    const { t, i18n: { language } } = useTranslation();
    return (
        <Door
            link={{ path: routesPaths.translatePath('/en/signup', language), text: t('register.Need an account', 'Need an account?') }}
            title={t('Sign in')}
            alreadySignedUp={true}
        />
    );
}
import React from 'react';
import { useTranslation } from 'react-i18next';
import Door from './Door';

import routesPaths from '../../app/routesPaths';

export default SignUp = () => {
    const { t, i18n: { language } } = useTranslation();
    return (
        <Door
            link={{ path: routesPaths.translatePath('/en/signup', language), text: t('Already have an account', 'Already have an account?') }}
            title={t('Sign up')}
            alreadySignedUp={false}
        />
    );
}
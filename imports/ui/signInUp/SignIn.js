import React from 'react';
import Door from './Door';

export default SignIn = () =>
    <Door
        link={{ path: '/signup', text: 'Need an account?' }}
        title='Sign In'
        alreadySignedUp={true}
    />;
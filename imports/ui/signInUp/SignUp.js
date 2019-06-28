import React from 'react';
import Door from './Door';

export default SignUp = () =>
    <Door
        link={{ path: '/signin', text: 'Already have an account?' }}
        title='Sign Up'
        alreadySignedUp={false}
    />;
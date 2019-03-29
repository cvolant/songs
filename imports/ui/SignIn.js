import React from 'react';
import PropTypes from 'prop-types';

import Door from './Door';

export default SignIn = props => {
    return (
        <div>
            <Door linkChild={props.linkChild} title='Sign In' alreadySignedUp={true} />
        </div>
    );
}

SignIn.propTypes = {
    linkChild: PropTypes.object,
};
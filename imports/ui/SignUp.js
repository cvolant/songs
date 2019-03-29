import React from 'react';
import PropTypes from 'prop-types';

import Door from './Door';

export default SignUp = props => {
    return (
        <div>
            <Door linkChild={props.linkChild} title='Sign Up' alreadySignedUp={false} />
        </div>
    );
}

SignUp.propTypes = {
    classes: PropTypes.object.isRequired,
    linkChild: PropTypes.object,
};
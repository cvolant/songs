import React from "react";
import { Accounts } from "meteor/accounts-base";
import { createContainer } from 'meteor/react-meteor-data';
import PropTypes from "prop-types";

export const PrivateHeader = props => {
  return (
    <div className="head-bar">
      <div className='head-bar__content'>
        <h1 className='head-bar__title'>{props.title}</h1>
        <button className='button button--link-text' onClick={() => props.handleLogout()}>Logout</button>
      </div>
    </div>
  );
};

PrivateHeader.propTypes = {
  title: PropTypes.string.isRequired,
  handleLogout: PropTypes.func.isRequired
};

export default createContainer(() => {
  return {
    handleLogout: () => Accounts.logout()
  };
}, PrivateHeader);
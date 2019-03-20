import React from "react";
import { Accounts } from "meteor/accounts-base";
import PropTypes from "prop-types";

const PrivateHeader = props => {
  return (
    <div className="head-bar">
      <div className='head-bar__content'>
        <h1 className='head-bar__title'>{props.title}</h1>
        <button className='button button--link-text' onClick={() => Accounts.logout()}>Logout</button>
      </div>
    </div>
  );
};

PrivateHeader.propTypes = {
  title: PropTypes.string.isRequired
};

export default PrivateHeader;

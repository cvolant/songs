import React from 'react';
import { Accounts } from 'meteor/accounts-base';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Session } from 'meteor/session';

export const PrivateHeader = ({
  handleLogout,
  isNavOpen,
  title,
  toggleNav,
}) => {
  const navImageSrc = isNavOpen ? '/images/x.svg' : '/images/bars.svg';

  return (
    <div className="head-bar">
      <div className="head-bar__content">
        <img className="head-bar__nav-toggle" src={navImageSrc} alt="Menu button" onClick={toggleNav} />
        <h1 className="head-bar__title">{title}</h1>
        <button className="button button--link-text" onClick={() => handleLogout()}>Logout</button>
      </div>
    </div>
  );
};

PrivateHeader.propTypes = {
  title: PropTypes.string.isRequired,
  handleLogout: PropTypes.func.isRequired,
  isNavOpen: PropTypes.bool.isRequired,
  toggleNav: PropTypes.func.isRequired,
};

export default withTracker(() => ({
  handleLogout: () => Accounts.logout(),
  isNavOpen: Session.get('isNavOpen'),
  toggleNav: () => Session.set('isNavOpen', !Session.get('isNavOpen')),
}))(PrivateHeader);

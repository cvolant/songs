const React = require('react');
const specialLog = require('./specialLog').default;

module.exports = {
  withTracker: (wPropsProvider) => (WrappedComponent) => (props) => {
    const newProps = wPropsProvider(props);
    for (let key in props) {
      newProps[key] = props[key];
    }
    return React.createElement(WrappedComponent, newProps);
  },
};
 
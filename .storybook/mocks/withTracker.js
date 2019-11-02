// FIXME: we can't use ES6 imports in mocks, not sure why

module.exports = {
  withTracker: (wPropsProvider) => (WrappedComponent) => (props) => ({
    props,
    wrapperProps: wPropsProvider(),
    WrappedComponent,
  })
};
 
module.exports = {
  withTracker: (wPropsProvider) => (WrappedComponent) => (props) => ({
    props,
    wrapperProps: wPropsProvider(),
    WrappedComponent,
  })
};
 
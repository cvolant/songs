// FIXME: we can't use ES6 imports in mocks, not sure why
module.exports = (wPropsProvider) => (WrappedComponent) => (props) => {
  const wProps = wPropsProvider();
  return <WrappedComponent { ...props} {...wProps } />;
};
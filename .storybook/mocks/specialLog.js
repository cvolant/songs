const specialLog = (name, returnValue) => (args) => {
  console.log(`-SbMock- ${name}:`, args || returnValue);
  return returnValue;
};

export default specialLog;

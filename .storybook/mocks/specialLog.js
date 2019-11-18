const stringify = (element) => {
  if (element === undefined) {
    return '';
  }
  let stringified = JSON.stringify(element);
  if (stringified.length > 50) {
    stringified = stringified.substr(0, 50) + '...';
  }
  return stringified;
};

const specialLog = (name, returnValue) => (args) => {
  console.log(`-SbMock- ${name}(${stringify(args)})${returnValue ? ` => ${stringify(returnValue)}` : ''}.`);
  return returnValue;
};

export default specialLog;

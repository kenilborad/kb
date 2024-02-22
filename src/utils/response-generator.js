const getResponse = (responseStatusCode, responseStatusMessage, data) => {
  const responseData = data || [];
  return {
    code: responseStatusCode,
    message: responseStatusMessage,
    data: responseData,
  };
};

module.exports = getResponse;

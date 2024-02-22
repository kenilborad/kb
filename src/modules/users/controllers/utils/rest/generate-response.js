const generateResponse = (data = {}, message, status = 'SUCCESS') => {
  const response = {
    data,
    message,
    status,
  };
  return response;
};

module.exports = generateResponse;

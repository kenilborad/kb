const messages = require('./intl/locales/en.json');

const getMessage = (key, localeService, localeServiceReplacements = {}) => {
  // eslint-disable-next-line security/detect-object-injection
  if (messages[key]) {
    if (localeService) {
      return localeService.translate(key, localeServiceReplacements);
    }
    // eslint-disable-next-line security/detect-object-injection
    return messages[key];
  }
  return key;
};

module.exports = { getMessage };

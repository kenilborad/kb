const generatePutSignedUrl = require('../../../../shared-lib/aws/functions/generate-put-signed-url');
const { getMessage } = require('../../../../utils/messages');
const awsLogger = require('../../aws-logger');
const path = require('path');

const getSignedPutUrl = async (parent, args, ctx) => {
  try {
    awsLogger.debug('modules/aws/resolvers/queries/get-signed-put-url');
    awsLogger.info('generating signed put url...');

    const { localeService } = ctx;
    const { data: { fileName, contentType } } = args;
    const { name, ext } = path.parse(fileName);

    const fileKey = `${name.trim().replace(/ /g, '_')}_${Date.now()}${ext}`;

    const { signedUrl } = await generatePutSignedUrl(fileKey, contentType, ctx);

    const response = {
      data: { signedUrl, key: fileKey },
      message: getMessage('SIGNED_URL_SUCCESS', localeService),
    };

    return response;
  } catch (err) {
    console.log(err);
    awsLogger.error(`Error from getSignedPutUrl resolver => ${err}`, ctx);
    throw err;
  }
};

module.exports = getSignedPutUrl;

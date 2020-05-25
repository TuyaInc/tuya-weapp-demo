const cloud = require('wx-server-sdk')
cloud.init();
const log = cloud.logger()

const httpRequest = require('./httpRequest')

exports.main = async function (event, context) {
  let { action, params, client_id } = event;

  const wxContext = cloud.getWXContext(context);
  try {
    const { code, msg, success, result } = await httpRequest({ params, action, wxContext, client_id })
    return { errorCode: code, errorMsg: msg, data: result, success }
  } catch (error) {
    log.info({ errorCode: '500', errorMsg: error, action, params, client_id })
    return { errorCode: '500', errorMsg: error, data: [], success: false }
  }
}
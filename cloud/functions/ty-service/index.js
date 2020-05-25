const { main } = require('./tuya-smart/src/index')

exports.main = async (event, context) => {
    return await main(event, context)
}
const { main } = require('./tuya-smart/index')

exports.main = async (event, context) => {
    return await main(event, context)
}
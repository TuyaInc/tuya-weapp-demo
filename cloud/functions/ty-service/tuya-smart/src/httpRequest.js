const http = require('http')
const request = require('request')
const crypto = require('crypto');
const cloud = require('wx-server-sdk');

const utils = require('./utils')

module.exports = utils.warpPromise(doRequest)
const COLLECTION_NAME = 'iot-collection';

const baseConfig = {
    developmentUrl: 'https://openapi-cn.wgine.com/action',
    productionUrl: 'https://openapi.tuyacn.com/faas',
    client_id: '',
    secret: '',
    headers: {
        'sign_method': 'HMAC-SHA256',
        'Content-Type': 'application/json'
    },
    timeout: 15000
}

async function doRequest(args) {
    const config = args.config || baseConfig
    const method = args.method || 'post'
    const timer = new Date().valueOf()
    const {
        action,
        params
    } = args
    const wxContext = args.wxContext || {}
    const {
        APPID,
        OPENID
    } = wxContext

    const db = cloud.database();
    const { data } = await db.collection(COLLECTION_NAME).get()


    const {
        AccessID,
        AppSecret,
        Schema,
        env
    } = data[0]

    const isDev = env === 'development'

    config.client_id = AccessID
    config.secret = AppSecret

    // 处理服务端的 OPENID
    if (params && params.open_id === 'cloud') {
        params.open_id = OPENID
    }

    if (params && params.app_schema === 'cloud') {
        params.app_schema = Schema
    }
    let url = config.productionUrl
    if (isDev) {
        url = config.developmentUrl
        console.log('collection data is', data)
        console.log('params is ', args)
    }


    const body = Object.assign({}, {
        action,
        params: {
            ...params
        }
    })
    utils.filterUndefined(body)

    const bodyText = JSON.stringify(utils.objKeySort(params))
    const text = `${config.client_id}${bodyText}${timer}`
    const client_id = args.client_id || config.client_id

    const sign = crypto.createHmac('sha256', config.secret).update(text).digest('hex').toUpperCase();
    const wxAppId = crypto.createHash('md5').update(APPID).digest('hex')

    const headers = {
        sign,
        wxAppId,
        client_id,
        't': timer,
    }

    const opts = {
        url,
        method,
        timeout: config.timeout || 15000,
        headers: Object.assign({}, config.headers, args.headers, headers),
        body,
        json: true
    }

    try {
        return await new Promise(function (resolve, reject) {
            request(opts, function (err, response, body) {
                args && args.callback && args.callback(response)
                if (err) {
                    return reject(err)
                }

                if (response.statusCode === 200) {
                    let res
                    try {
                        res = typeof body === 'string' ? JSON.parse(body) : body
                    } catch (e) {
                        res = body
                    }

                    isDev ? console.log('res', res) : ''

                    return resolve(res)
                } else {
                    // 避免非 200 错误导致一直不返回
                    const e = new Error(`${response.statusCode} ${http.STATUS_CODES[response.statusCode]}`)
                    e.statusCode = response.statusCode
                    reject(e)
                }
            })
        })
    } catch (err) {
        console.log('err', err);
    }
}
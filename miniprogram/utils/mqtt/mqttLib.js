import { EventEmitter } from '../../libs/events';
import { isWx } from './util';
import Mqtt from '../../libs/mqtt.min.js';
import CryptoJS from '../../libs/ctypto-js'

const CONNECT = 'connect';
const MESSAGE = 'message';
const PACKETSEND = 'packetsend';
const PACKETRECEIVE = 'packetreceive';
const ERROR = 'error';
const CLOSE = 'close';
const OFFLINE = 'offline';
const DISCONNECT = 'disconnect';
const END = 'end';

const mqttEvents = [
  CONNECT,
  MESSAGE,
  PACKETSEND,
  PACKETRECEIVE,
  ERROR,
  CLOSE,
  OFFLINE,
  DISCONNECT,
  END
];

// 校验password有效期
function checkSign(data, accessKey) {
  const { sign, ...rest } = data;
  const sortedArray = Object.keys(rest)
    .sort((a, b) => (a < b ? -1 : 1))
    .reduce((previousValue, currentValue) => {
      if (!rest[currentValue] && rest[currentValue] !== 0) return previousValue;
      return previousValue.concat(`${currentValue}=${rest[currentValue]}`);
    }, []);
  sortedArray.push(accessKey);
  const derivedStr = sortedArray.join('||');
  const calculatedSign = CryptoJS.MD5(derivedStr).toString();
  return calculatedSign === sign;
}

// 解密消息
function aesDecrypt(encryptedMessage, secretPassphrase, option) {
  secretPassphrase = CryptoJS.enc.Utf8.parse(secretPassphrase);
  return CryptoJS.AES.decrypt(encryptedMessage, secretPassphrase, option).toString(
    CryptoJS.enc.Utf8
  );
}

// 校验是否为mqtt的连接
function isMqttConnection(config) {
  if (!config) return false;
  let protocols = config.protocols;
  if (!Array.isArray(protocols)) protocols = [protocols];
  return !!~protocols.indexOf('mqtt');
}

class MqttLib {
  // socketTask; // wx的socketTask对象
  // password; // 用于解密后的密码
  // emitter; // 事件对象类
  // originConnectSocket; // 保存改写前的wx的socketTask对象

  constructor() {
    this.emitter = new EventEmitter()
    this.init();
  }

  // 获取wx的socketTask对象，并且监听其close,error事件
  init() {
    if (isWx()) {
      const connectSocket = wx.connectSocket;
      this.originConnectSocket = connectSocket;
      let that = this;
      function modifiedConnectSocket(config) {
        const isMqtt = isMqttConnection(config);
        const maybeSocketTask = connectSocket.call(wx, config);
        if (isMqtt) {
          that.socketTask = maybeSocketTask;

          // 单独监听mqtt的socketTask的 onClose, onError 事件，无需再去监听网络变化
          that.socketTask.onError(({ errMsg }) => {
            // if (!that.isWorking) return;
            this.emitter.emit(ERROR, {
              type: 'error',
              reason: errMsg
            });
          });
          that.socketTask.onClose(({ code, reason }) => {
            // if (!that.isWorking) return;
            that.emitter.emit(CLOSE, {
              type: 'close',
              code,
              reason
            });
          });
        }
        return maybeSocketTask;
      }

      Object.defineProperty(wx, 'connectSocket', {
        value: modifiedConnectSocket
      });

    } else {
      console.log('do nothing');
    }
  }

  // mqtt连接
  connect(mqttUrl, mqttConnectOptions) {
    let { subscribeTopics, password } = mqttConnectOptions;

    // 去除多余的前缀的wxs/wss。这个由环境自动加上
    const prefix = isWx() ? 'wxs://' : 'wss://';
    let url = prefix + mqttUrl.split('//')[1];

    const mqttClient = Mqtt.connect(url, mqttConnectOptions);

    this.mqttClient = mqttClient;

    mqttClient.on('connect', () => {
      // 保存password，供解密
      this.password = password;
      // 订阅消息
      mqttClient.subscribe(subscribeTopics,(err)=> {
        console.log('err', err)
      });

      // 监听所有mqtt事件，并且用eventEmitter派发出去
      // 无需自己保存回调函数，eventEmitter来完成这个事情
      mqttEvents.forEach((mqttEvent) => {
        mqttClient.on(mqttEvent, (...args) => {
          if (mqttEvent === MESSAGE) {
            // message事件，解密后再emit
            let message = this.onMessage(args[1]);
            if (message) this.emitter.emit(mqttEvent, args[0], message);
          } else if (mqttEvent === ( CLOSE || ERROR )) {
            if(!isWx()) this.emitter.emit(mqttEvent, args);
          } else {
            this.emitter.emit(mqttEvent, args);
          }
        });
      });
    });

    return mqttClient;
  }

  // 消息解密
  onMessage(payload) {
    const receivedObject = JSON.parse(payload.toString());
    const isSignValid = checkSign(receivedObject, this.password);
    if (isSignValid) {
      let msg = receivedObject.data;
      const decryptData = aesDecrypt(msg, this.password.substring(8, 24), {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      });

      return JSON.parse(decryptData);
    } else {
      console.warn('check sign invalid', receivedObject);
    }
  };

  // 添加封装后的监听事件
  addMqttEventListener(event, cb) {
    this.emitter.on(event, cb);

    // return () => {
    //   this.removeMqttEventListener(event, cb);
    // };
  }

  // 移除封装后的监听事件
  removeMqttEventListener(event, cb) {
    this.emitter.off(event, cb);
  }

  /**
   * destory销毁mqtt实例，解绑全部的listener
   */
  destroy() {
    this.mqttClient && this.mqttClient.end(true);
    this.mqttClient = undefined;
    mqttEvents.forEach((mqttEvent) => {
      this.removeMqttEventListener(mqttEvent);
    });

    // destroy 在小程序，解除network的监听， 解除defineProperty，解除全部事件监听
    if (isWx()) {
      Object.defineProperty(wx, 'connectSocket', {
        value: this.originConnectSocket
      });
      wx.offNetworkStatusChange(this.networkChangeHandler);
    }
    this.emitter.off(EVENT);
  }
}

export default new MqttLib();

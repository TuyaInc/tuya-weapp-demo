import MqttLibs from './mqttLib';
import { getMqttconfig } from '../api/device-api'

let count = 0

class wxMqtt {
  constructor() {}

  async connectMqtt() {

    let {
      client_id,
      password,
      source_topic: { device: topic },
      url,
      username
    } = await getMqttconfig()

    if (url) {
      const mqttClient = MqttLibs.connect(url, {
        clientId: client_id,
        username,
        password,
        subscribeTopics: topic,
        reconnectPeriod: 0,
        keepalive: 60
      });

      this._mqttClient = mqttClient;

      return mqttClient
    }

  }

  // 添加封装后的监听事件
  on(event, cb) {
    MqttLibs.addMqttEventListener(event, cb);
  }

  off(event, cb) {
    MqttLibs.removeMqttEventListener(event, cb)
  }

  reconnectMqtt() {
   this.connectMqtt()
  }
}

export default new wxMqtt();

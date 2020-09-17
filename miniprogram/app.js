//app.js
import wxMqtt from './utils/mqtt/wxMqtt'
import { Provider } from './libs/wechat-weapp-redux.min';
import { configStore } from './utils/store/store';

const store = configStore();

App(Provider(store)({
  onLaunch: async function() {
    wx.cloud.init()
    wxMqtt.connectMqtt()

    wxMqtt.on('close', (errorMsg) => {
      wxMqtt.connectMqtt()
      console.log('errorMsg: mqttClose', errorMsg);
    })

    wxMqtt.on('error', (errorMsg) => {
      wxMqtt.connectMqtt()
      console.log('errorMsg: mqttError', errorMsg);
    })
  },
  onShow: async function() {
  }
}))
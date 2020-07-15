import '@tarojs/async-await'
import { Provider } from '@tarojs/redux'
import Taro, { Config } from '@tarojs/taro'
// import ClientMqtt from 'src/Common/js/mqtt'
import 'taro-ui/dist/style/index.scss'

import models from './Models/Index'
import dva from './Utils/Dva'
import Index from './Views/DeviceList'

// 初始化 dva
const dvaApp = dva.createApp({
  initialState: {},
  models: models
})

// 获取全局 store
const store = dvaApp.getStore()

class App extends Taro.Component {
  // 小程序全局配置
  config: Config = {
    pages: [
      'Views/DeviceList/Index',
      'Views/Panel/Index',
      'Views/Kg/Index',
    ],
    window: {
      backgroundColor: '#F6F6F6',
      backgroundTextStyle: 'dark',
      navigationBarBackgroundColor: '#F6F6F6',
      navigationBarTitleText: '涂鸦智控',
      navigationBarTextStyle: 'black'
    },
    permission: {
      'scope.userLocation': {
        desc: '你的位置信息将用于小程序位置接口的效果展示'
      }
    }
  }

  // 页面渲染完成时处理
  componentDidMount() {
    // 云函数初始化
    Taro.cloud.init()
    // 连接 MQTT
    // ClientMqtt.connectMqtt()
    // // socket 断开时重新连接
    // Taro.onSocketClose(res => {
    //   ClientMqtt.connectMqtt()
    // })
  }
  // 页面渲染
  render(): JSX.Element {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))

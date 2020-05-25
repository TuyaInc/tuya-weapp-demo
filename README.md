

[wxSmartSdkDemo] 是小程序面板工程的最佳实践，包含了开发面板的基础框架，这篇文档会大致介绍一下模板为我们做了什么，以及我们需要如何基于模板开发一个全新的面板项目。


## 模板详解

### 目录详解

```
├── cloud                     // 云函数目录
│   ├── functions             // 云函数
│   │    ├── ty-service       // 涂鸦云函数 SDK
├── config                     // taro 配置文件夹
├── global.d.ts                // ts 全局命名空间
├── .eslintignore              // 配置哪些文件不需要eslint
├── .eslintrc                  // eslint配置文件
├── .gitignore                 // 配置哪些文件不需要git
├── README.md                  // 项目的说明信息
├── package.json               // npm依赖管理
├── project.config.json        // 小程序项目配置文件
├── tsconfig.json              // ts 全局配置文件·
├── src
│   ├── Common           // 涂鸦定义好的公共函数
│   ├── Components       // 放置项目中用到的各复用的功能组件
│   ├── Img              // 项目中用到的图片
│   ├── Models           // dva 中的 models
│   ├── Utils            // 公共函数
│   ├── Views            // 小程序具体的页面
│   ├── app.tsx          // 小程序入口文件
│   └── config.ts        // 公共的配置文件
└── yarn.lock
```

### app 详解

简单的来说，app 这个入口文件为我们所做的事情共三件；

1. 页面初始化时，初始化 `dva store`。

2. 生成小程序全局的配置。

3. MQTT 连接

```javascript
import '@tarojs/async-await'
import { Provider } from '@tarojs/redux'
import Taro, { Config } from '@tarojs/taro'
import ClientMqtt from 'src/Common/js/mqtt'
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
      'Views/Panel/Index'
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
    ClientMqtt.connectMqtt()
    // socket 断开时重新连接
    Taro.onSocketClose(res => {
      ClientMqtt.connectMqtt()
    })
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

```

### Panel 详解

Panel 是涂鸦官方的调试面板，可以借助这个面板了解开发思路；

Panel 下的目录结构是这样的
```
├── components                     // 页面内的组件，注意这个和全局共享的组件有区别，这个是小写的
├── index.module.less              // 页面的样式
├── Index.tsx                      // 页面逻辑
├── Model.ts                       // Model 文件
└── Services.ts                    // 接口调用
```

1. 先从 Index.ts 入手，。

```javascript
import { View } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import Taro, { Config } from '@tarojs/taro';
import Boolean from './components/Boolean';
import Enum from './components/Enum';
import Integer from './components/Integer';
import style from './index.module.less';


// 定义 props
interface IndexProps {
    dispatch: any;
    status: [{ code: string, type: string, value: any, values: any }]
}

// 定义 state
interface IndexState {
}

class Index extends Taro.Component<IndexProps, IndexState> {
    // 页面的 config
    config: Config = {
        navigationBarTitleText: ''
    }
    // 设备 id
    private deviceId: string;

    constructor(props: IndexProps): void {
        super(props);
    }

    // 从路由中获取设备 id
    componentWillMount(): void {
        const { deviceId } = this.$router.params
        this.deviceId = deviceId
    }

    componentDidMount(): void {
        const { dispatch } = this.props
        const deviceId = this.deviceId
        // 获取设备信息
        dispatch({ type: "Panel/getDetails", payload: { deviceId } })
    }

    componentWillReceiveProps(nextProps): void {
        const { deviceStatus: { devId, status } } = nextProps
        const { dispatch } = this.props

        // 如果从 MQTT 从获得消息，就更新页面
        if (devId === this.deviceId) {
            dispatch({ type: 'Panel/updateStatus', payload: { newStatus: status } })
        }
    }

    public render(): JSX.Element {
        const { status } = this.props

        return (
            <View className={style.root} >
                {
                    status.length && status.map(item =>
                        <View key={item.code} >
                            {item.type === 'Boolean' && <Boolean isChecked={item.value} dpCode={item.code} deviceId={this.deviceId} />}
                            {item.type === 'Integer' && <Integer dpCode={item.code} deviceId={this.deviceId} value={item.value} max={item.values.max} min={item.values.min} step={item.values.step} />}
                            {item.type === 'Enum' && <Enum dpCode={item.code} deviceId={this.deviceId} value={item.value} values={item.values} />}
                        </View>
                    )
                }
            </View>
        );
    }
}

export default connect(({ Panel, Mqtt }) => {
    return { ...Panel, ...Mqtt }
})(Index)

```
2. 接着看下 Model.ts 的数据处理，数据尽量在 Model 中处理完后，给到 Index.ts 就会是较为 “纯” 的数据，整体的逻辑可以保证较为清晰。在这里的 Model.ts 文件中，主要是处理了设备详情、设备功能点、设备状态的数据

```javascript
import Taro from '@tarojs/taro';
import * as Services from "./Services";

export default {
    namespace: "Panel",
    // state 为页面的状态集
    state: {
        name: "",
        online: true,
        functions: [],
        status: []
    },
    effects: {
        *getDetails({ payload }, { call, put }) {
            const { deviceId } = payload;
            // 得到设备详情
            const { name, online, status } = yield call(
                Services.getDetails,
                deviceId
            );
            // 得到设备功能点
            const { functions } = yield call(
                Services.getDeviceSpecifications,
                deviceId
            );
            // 修改页面的标题
            Taro.setNavigationBarTitle({ title: `${name}-调试面板` })
            yield put({ type: 'setStauts', payload: { name, online, status, functions } })
        }
    },
    reducers: {
        /**
         * 处理功能点和状态的数据
         * @param state 页面初始状态 
         * @param param 从接口获取的状态
         */
        setStauts(state, { payload }): void {
            const { status, functions } = payload
            // 处理功能点和状态的数据
            if (functions.length && status.length) {
                status.map(item => {
                    const code = item.code
                    const index = functions.findIndex(it => it.code === code)
                    if (index !== -1) {
                        const type = functions[index].type
                        const values = functions[index].values
                        // 对数据做转换
                        if (type === 'Boolean') {
                            item.value = JSON.parse(item.value)
                        }
                        if (type === 'Integer') {
                            item.value = Number(item.value)
                        }
                        item.type = type
                        item.values = JSON.parse(values)
                    }
                    return item
                })
            }
            return { ...state, ...payload, status }
        },
        /**
         * MQTT 消息回来 修改页面状态
         * @param state 原来的页面状态 
         * @param param 新的状态
         */
        updateStatus(state, { payload }): void {
            const { status } = state
            const { newStatus } = payload
            newStatus.map(item => {
                const code = item.code
                const index = status.findIndex(item => item.code === code)
                status[index].value = item.value
            })
            return { ...state, status }
        }
    }
};

```

3. SDK 接口的调用，通过涂鸦写的官方请求方法，可以请求到 SDK 中的具体的接口，完成对应的接口调用，SDK 中已做了参数传参，返回值处理，授权等操作

```javascript
import Request from "../../Utils/Request";

/**
 * 获取设备状态和功能点
 * @param device_id 设备id
 */
const getDeviceSpecifications = device_id => {
    const params = {
        name: "ty-service",
        data: {
            action: "device.specifications",
            params: {
                device_id
            }
        }
    };
    return Request(params);
};

/**
 * 获取设备详情
 * @param device_id 设备 id
 */
const getDetails = device_id => {
    const params = {
        name: "ty-service",
        data: {
            action: "device.details",
            params: {
                device_id
            }
        }
    };
    return Request(params);
};

export { getDeviceSpecifications, getDetails };

```

### 设备详情常见的字段

- name: 设备名称
- productId: 产品 id
- uiId: 当前产品对应的面板 id
- bv: 硬件基线版本
- devId: 设备 Id
- gwId: 网关 Id, 如果是单品，devId 一般和 gwId 相等
- ability: 只有蓝牙设备使用, 如果是单点蓝牙设备，值是 5
- AppOnline: App 是否在线
- deviceOnline: 设备是否在线
- isLocalOnline: 局域网是否在线
- isShare: 是否是共享设备
- isVDevice: 是否是演示设备
- groupId: 群组设备 Id，可用于判断是否群组设备
- networkType: 设备的在线类型
- capability: 设备的能力类型, 标志设备支持什么能力， 如支持 ZigBee, 红外, 蓝牙等
- schema: 设备所属产品的功能点(dp, data point)定义, 功能点解释请看 [dp 解释](https://docs.tuya.com/cn/product/function.html#%E5%A6%82%E4%BD%95%E8%87%AA%E5%AE%9A%E4%B9%89%E5%8A%9F%E8%83%BD%E7%82%B9)
- state: dp 点的状态


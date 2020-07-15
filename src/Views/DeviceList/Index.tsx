import Taro, { Config } from '@tarojs/taro'
import { connect } from '@tarojs/redux'
import { View, Image, Text } from '@tarojs/components'

import { whitout } from '../../Img'
import { testCloud } from './Services'
import style from './Index.module.less'

interface IndexProps {
  dispatch: any
  deviceList: any
}

interface IndexState { }

class Index extends Taro.Component<IndexProps, IndexState> {
  config: Config = {
    navigationBarTitleText: '涂鸦智控'
  }

  constructor(props: IndexProps) {
    super(props)
    this.state = {}
  }

  componentDidShow() {
    const { dispatch } = this.props
    dispatch({ type: 'DeviceList/getDeviceList', payload: {} })
  }

  async componentDidMount() {
    const res = await testCloud()

    if (res) {
      Taro.showToast({
        title: res,
        icon: "none",
        duration: 3000,
        mask: true
      });
    } else {
      Taro.showToast({
        title: '您的云函数未配置成功，请按照文档配置',
        icon: "none",
        duration: 3000,
        mask: true
      });
    }
  }

  turnDevicePage = (device: any) => {
    const { category, id } = device;

    switch (category) {
      case 'cz': {
        Taro.navigateTo({
          url: `/Views/Kg/Index?device_id=${id}`
        })
        break;
      }
      default:
        Taro.navigateTo({
          url: `/Views/Panel/Index?deviceId=${id}`
        });
        break;
    }
  }

  public render(): JSX.Element {
    const { deviceList } = this.props

    return (
      <View className={style.root}>
        <View className={style.header}>
          <View className={style.header_home}>所有设备</View>
        </View>
        {(!deviceList || !deviceList.length) && (
          <View className={style.whitout}>
            <Image className={style.whitout_img} src={whitout} />
            <Text className={style.whitout_text}>暂无设备，请添加</Text>
          </View>
        )}
        {Array.isArray(deviceList) &&
          deviceList.length &&
          deviceList.map(item => (
            <View className={style.list} key={item.id} onClick={() => this.turnDevicePage(item)}>
              <Image className={style.list_img} src={`https://images.tuyacn.com/${item.icon}`} />
              <View className={style.list_name}>{item.name}</View>
            </View>
          ))}
      </View>
    )
  }
}

export default connect(({ DeviceList }) => DeviceList)(Index)

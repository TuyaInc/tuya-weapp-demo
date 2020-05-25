import Taro, { Config } from '@tarojs/taro'
import { connect } from '@tarojs/redux'
import { View, Image, Text } from '@tarojs/components'

import { whitout } from '../../Img'
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

  turnDevicePage = (device: any) => {
    const { id } = device
    Taro.navigateTo({
      url: `/Views/Panel/Index?deviceId=${id}`
    })
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

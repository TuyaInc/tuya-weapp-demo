import Taro, { Config } from '@tarojs/taro';
import { connect } from '@tarojs/redux';
import { View, Image, Text } from '@tarojs/components';
import { dcOn } from '@/img/Kg/index';
import style from './Index.module.less';

interface IndexProps {
  dispatch: any;
}

interface IndexState {
  isShow: boolean;
  statusCount: number
}

class Index extends Taro.Component<IndexProps, IndexState> {
  timer: any;

  config: Config = {
    navigationBarTitleText: 'Kg'
  };

  constructor(props: IndexProps) {
    super(props);
    this.state = {
      isShow: false,
      statusCount: 0
    };
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch } = this.props;
    const { status, devId, currentStatus, isMqttAction } = nextProps;
    const { device_id } = this.$router.params;
    // 初次获取设备状态渲染
    const { statusCount } = this.state;
    if (
      statusCount === 0 &&
      status !== undefined &&
      Array.isArray(status) &&
      status.length !== 0
    ) {
      this.onDataChange(status);
      this.setState({ statusCount: 999 });
    }
    // Mqtt回调
    if (!isMqttAction) return;
    if (devId === undefined) return;
    if (
      devId === device_id &&
      Array.isArray(currentStatus) &&
      currentStatus.length !== 0
    ) {
      dispatch({ type: 'Mqtt/closeMqttAction' });
      this.onDataChange(currentStatus);
    }
  }

  async componentDidShow() {
    const { dispatch } = this.props;
    const { device_id } = this.$router.params;
    Taro.setNavigationBarColor({frontColor: '#ffffff' ,backgroundColor: '#ff5858'})
    await dispatch({ type: 'Kg/getDeviceConfig', payload: { device_id } });
    await dispatch({ type: 'Kg/getDeviceStatus', payload: { device_id } });
  }

  onDataChange = (status: any[]) => {
    // const { dispatch } = this.props;
    status.forEach((item) => {
      const { code, value } = item;
      switch (code) {
        case 'switch_1': {
          this.setState({ isShow: value });
          break;
        }
        default:
          break;
      }
    });
  };

  turnDeviceOn = () => {
    const { isShow } = this.state;
    this.sendDp('switch', !isShow);
  };

  sendDp = (code: string, value: any) => {
    const { dispatch } = this.props;
    const { device_id } = this.$router.params;
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      dispatch({ type: 'Kg/sendDps', payload: { device_id, code, value } });
    }, 500);
  };

  public render(): JSX.Element {
    const { isShow } = this.state
    return (
      <View className={style.root}>
        <Image className={style.image} src={dcOn} onClick={this.turnDeviceOn} />
        <Text className={style.label}>{isShow ? '插座已开启' : '插座已关闭'}</Text>
      </View>
    );
  }
}

export default connect(({ Kg, Mqtt }) => {
  return {
    ...Kg,
    ...Mqtt
  };
})(Index);

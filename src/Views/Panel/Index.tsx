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


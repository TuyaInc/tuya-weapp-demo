import Taro from '@tarojs/taro';
import { connect } from '@tarojs/redux';
import { AtSwitch } from 'taro-ui'

import { View } from '@tarojs/components';

import style from './index.module.less';
import { sendControlCommand } from '@/Utils/index'

interface IndexProps {
    isChecked: boolean;
    dpCode: string;
    deviceId: string;
}

interface IndexState {
    isChecked: boolean
}

class Index extends Taro.Component<IndexProps, IndexState> {

    constructor(props: IndexProps) {
        super(props);
        this.state = {
            isChecked: false
        };
    }

    componentDidMount() {
        const { isChecked } = this.props
        this.setState({ isChecked })
    }

    onChange = (): void => {
        const { deviceId, dpCode, isChecked } = this.props
        sendControlCommand(deviceId, dpCode, !isChecked)
    }

    public render(): JSX.Element {
        const { isChecked } = this.state
        const { dpCode } = this.props

        return (
            <View className={style.container} >
                <AtSwitch border={false} onChange={this.onChange}  checked={isChecked} title={dpCode} />
            </View>
        );
    }
}

export default connect(({ Panel }) => Panel)(Index);


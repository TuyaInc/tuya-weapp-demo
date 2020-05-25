import Taro from '@tarojs/taro';
import { connect } from '@tarojs/redux';
import { AtInputNumber } from 'taro-ui'

import { View } from '@tarojs/components';

import style from './index.module.less';
import { sendControlCommand } from '@/Utils/index'

interface IndexProps {
    dpCode: string;
    deviceId: string;
    step: number,
    min: number,
    max: number,
    value: number
}

interface IndexState {
}

class Index extends Taro.Component<IndexProps, IndexState> {

    constructor(props: IndexProps) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
    }

    onChange = (value): void => {
        const { deviceId, dpCode } = this.props
        sendControlCommand(deviceId, dpCode, value)
    }
    public render(): JSX.Element {
        const { step, min, max, value, dpCode } = this.props

        return (
            <View className={style.container} >
                {dpCode} ：<AtInputNumber type="number" onChange={this.onChange} value={value} step={step} min={min} max={max} />
            </View>
        );
    }
}

export default connect(({ Panel }) => Panel)(Index);


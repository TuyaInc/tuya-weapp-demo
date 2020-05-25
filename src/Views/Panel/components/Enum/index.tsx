import Taro from '@tarojs/taro';
import { connect } from '@tarojs/redux';
import { AtActionSheet, AtActionSheetItem } from "taro-ui"

import { View, Text } from '@tarojs/components';

import style from './index.module.less';
import { sendControlCommand } from '@/Utils/index'

interface IndexProps {
    dpCode: string;
    deviceId: string;
    value: string;
    values: { range: [] };
}

interface IndexState {
    isOpened: boolean
}

class Index extends Taro.Component<IndexProps, IndexState> {

    constructor(props: IndexProps) {
        super(props);
        this.state = {
            isOpened: false
        };
    }

    onChange = (value): void => {
        const { deviceId, dpCode } = this.props
        this.onClickClose()
        sendControlCommand(deviceId, dpCode, value)
    }

    onDpClick = () => {
        this.setState({ isOpened: true })
    }

    onClickClose = () => {
        this.setState({ isOpened: false })
    }

    public render(): JSX.Element {
        const { dpCode, value, values } = this.props
        const { isOpened } = this.state
        let range = []
        if (values && values.range) {
            range = values.range
        }

        return (
            <View className={style.container} >
                <View>{dpCode}</View>
                <View>
                    <AtActionSheet isOpened={isOpened} cancelText='取消' title="请选择" onClose={this.onClickClose} onCancel={this.onClickClose} >
                        {
                            range && range.map(item => <AtActionSheetItem key={item} onClick={() => this.onChange(item)} >{item}</AtActionSheetItem>)
                        }
                    </AtActionSheet>
                    <Text onClick={this.onDpClick} >{value}</Text>
                </View>
            </View>
        );
    }
}

export default connect(({ Panel }) => Panel)(Index);


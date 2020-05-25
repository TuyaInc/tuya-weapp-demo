
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

import * as Services from "./Services";

export default {
    namespace: "DeviceList",
    state: {
        sprayList: []
    },
    effects: {
        *getDeviceList({ payload }, { call, put }) {
            const result = yield call(Services.getDeviceList);
            yield put({ type: "setState", payload: { deviceList: result } });
        }
    },
    reducers: {
        setState(state, { payload }): void {
            return { ...state, ...payload };
        }
    }
};

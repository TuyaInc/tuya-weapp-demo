import * as Services from './Services';

export default {
  namespace: 'Kg',
  state: {},
  effects: {
    *getDeviceStatus({ payload }, { call, put }) {
      const { device_id } = payload;
      const result = yield call(() => Services.getDeviceStatus(device_id));
      yield put({
        type: 'setState',
        payload: { status: result, device_id: payload.device_id }
      });
    },
    *getDeviceConfig({ payload }, { call, put }) {
      const result = yield call(() =>
        Services.getDeviceConfig(payload.device_id)
      );
      // const { functions } = result
      // let dpMode: any = {}
      // if (Array.isArray(functions) && functions.length !== 0) {
      //   dpMode = Services.getKtStatusMode(functions)
      // }
    },
    *sendDps({ payload }) {
      const { code, value, device_id } = payload;
      yield Services.sendDps(device_id, code, value);
    }
  },
  reducers: {
    setState(state, { payload }): void {
      return { ...state, ...payload };
    }
  }
};

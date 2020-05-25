export default {
    namespace: "Mqtt",
    state: {
        deviceStatus: {
            devId: '',
            status: []
        }
    },
    reducers: {
        deviceStatusUpdate(state, { payload }): void {
            console.log("payload", payload);
            return { ...state, ...payload };
        }
    }
};

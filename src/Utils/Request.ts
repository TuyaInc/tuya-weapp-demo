import Taro from "@tarojs/taro";

interface params {
    name: string;
    data: { action: string; params: object };
}

let count = 5;

export const login = async () => {
    const params = {
        name: "ty-service",
        data: {
            action: "user.wx-applet.synchronization",
            params: {
                open_id: "cloud",
                app_schema: "cloud"
            }
        }
    };

    const { uid } = await request(params);
    Taro.setStorageSync("uid", uid);
};

const setUid = async (params: params) => {
    const {
        data: { action }
    } = params;
    let uid = Taro.getStorageSync("uid");
    const isNoLogin = action !== "user.wx-applet.synchronization";
    if (!uid && isNoLogin && count > 0) {
        console.log("count", count);
        await login();
        count--;
        return setUid(params);
    }
    if (uid && isNoLogin) {
        params.data.params || (params.data.params = {});
        params.data.params["uid"] = uid;
    }
    params.data.params["uid"] = uid;
};

const request = async (params: params) => {
    await setUid(params);

    try {
        const { success, data, errorCode, errorMsg } = (
            await Taro.cloud.callFunction(params)
        ).result;
        if (success) return data;

        Taro.showToast({
            title: `${errorMsg}`,
            icon: "none",
            duration: 3000,
            mask: true
        });
    } catch (error) {
        Taro.showToast({
            title: "网络错误！",
            icon: "none",
            duration: 3000,
            mask: true
        });
    }
    return [];
};

export default request;

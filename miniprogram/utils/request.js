// 重新请求限制
let count = 5;

export const login = async () => {
  const params = {
    name: 'ty-service',
    data: {
      action: 'user.wx-applet.synchronization',
      params: {
        open_id: 'cloud',
        app_schema: 'cloud'
      }
    }
  };

  const { uid } = await request(params);
  wx.setStorageSync('uid', uid);
};

const setUid = async (params) => {
  const {
    data: { action }
  } = params;
  let uid = wx.getStorageSync('uid');
  const isNoLogin = action !== 'user.wx-applet.synchronization';
  if (!uid && isNoLogin && count) {
    await login();
    count--;
    return setUid(params);
  }
  if (uid && isNoLogin) {
    params.data.params || (params.data.params = {});
    params.data.params['uid'] = uid;
  }
};

const request = async (params) => {
  await setUid(params);

  try {
    const { success, data, errorCode, errorMsg, t } = (
      await wx.cloud.callFunction(params)
    ).result;
    if (success && data === true) {
      return { success, t }
    }else if(success) {
      return data
    }

    wx.showToast({
      title: `code:${errorCode}, message:${errorMsg}`,
      icon: 'none',
      duration: 3000,
      mask: true
    });
  } catch (error) {
    wx.showToast({
      title: '网络错误！',
      icon: 'none',
      duration: 3000,
      mask: true
    });
  }
  return [];
};

export default request;

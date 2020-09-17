// 云函数模板
// 部署：在 cloud-functions/ty-getClientId 文件夹右击选择 “上传并部署”
const cloud = require('wx-server-sdk');

// 初始化 cloud
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const _ = db.command;
const userInfo = db.collection('iot-collection');

exports.main = async (event, context) => {
  const { data } = await userInfo.get();
  const { AccessID } = data[0];

  return {
    success: true,
    data: {
      clientId: AccessID
    }
  };
};

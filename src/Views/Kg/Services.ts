import Request from "../../Utils/Request";

// 获取设备当前状态
const getDeviceStatus = (device_id) => {
  const params = {
    name: 'ty-service',
    data: {
      action: 'device.status',
      params: {
        device_id: device_id
      }
    }
  };
  return Request(params);
};

// 获取设备指令集和状态集
const getDeviceConfig = (device_id) => {
  const params = {
    name: 'ty-service',
    data: {
      action: 'device.specifications',
      params: {
        device_id: device_id
      }
    }
  };
  return Request(params);
};

// 下发dp指令
const sendDps = (device_id: string, code: string, value: any) => {
  const params = {
    name: 'ty-service',
    data: {
      action: 'device.control',
      params: {
        device_id: device_id,
        commands: [
          {
            code: code,
            value: value
          }
        ]
      }
    }
  };
  return Request(params);
};

export { getDeviceStatus, getDeviceConfig, sendDps };

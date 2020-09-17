import request from '../request'
// request 做了自动向params中添加uid的操作，因此可以不带入uid

// 获取mqtt配置
export const getMqttconfig = () => {
  return request({
    name: 'ty-service',
    data: {
      action: 'device.openHubConfig',
      params: {
        link_id: Math.random()
          .toString(10)
          .substring(2, 11),
        link_type: 'websocket'
      }
    }
  })
}

// 获取设备列表 
export const getDeviceList = () => {
  return request({
    name: 'ty-service',
    data: {
      action: 'device.getDeviceList',
      params: {}
    }
  })
}

// 获取设备最新状态
export const getDeviceStatus = (device_id) => {
  return request({
    name: 'ty-service',
    data: {
      action: 'device.status',
      params: {
        device_id
      }
    }
  })
}

// 获取设备指令集
export const getDeviceSpecifications = (device_id) => {
  return request({
    name: 'ty-service',
    data: {
      action: 'device.specifications',
      params: {
        device_id
      }
    }
  })
}


// 指令下发
export const deviceControl = (device_id, code, value) => {
  return request({
    name: 'ty-service',
    data: {
      action: 'device.control',
      params: {
        device_id,
        commands: [
          {
            code,
            value
          }
        ]
      }
    }
  })
}


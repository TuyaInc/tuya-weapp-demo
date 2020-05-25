import Request from '../../Utils/Request'

const getDeviceList = () => {
  const params = {
    name: 'ty-service',
    data: {
      action: 'device.getDeviceList',
      params: {}
    }
  }
  return Request(params)
}

export { getDeviceList }

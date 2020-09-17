// pages/deviceDisplay/index.js
import { getDeviceSpecifications, getDeviceStatus } from '../../utils/api/device-api'
import wxMqtt from '../../utils/mqtt/wxMqtt'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    functions: [],
    devid: '',
    message: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    const { devid } = options
    const newStatus = {}
    const newFunctions = []
    const { functions } = await getDeviceSpecifications(devid)
    const DeviceStatus = await getDeviceStatus(devid)

    const countdownTest = new RegExp('^countdown')

    DeviceStatus.forEach(item => {
      newStatus[`${item.code}`] = item.value
    })

    functions.forEach(item =>{
      if(!countdownTest.test(item.code)) {
        newFunctions.push(item)
      }
    })

    this.setData({ functions: newFunctions, devStatus: newStatus, devid, countdownTest })

    //mqtt消息监听
    wxMqtt.on('message', (topic, newVal) => {
      // console.log('message')
      let { message, devStatus } = this.data
      let newStatus = {}
      const { status } = newVal
            
      status.forEach(item => {
        newStatus[`${item.code}`] = item.value
        item.type = '接收'
      })
            
      devStatus = { ...devStatus, ...newStatus }
            
      this.setData({ message: [].concat(message, status), devStatus })
    })
  },

  onUnload: function () {
    wxMqtt.off('message', ()=>{console.log('页面已销毁，取消mqtt监听')})
  },

  sendMessage: function (e) {
    // console.log('sendMessage')
    const { message } = this.data
    const { dpCode, value, t } = e.detail

    const sendMessage = {
      code: dpCode,
      type: '发送',
      value,
      t
    }
    this.setData({ message: [].concat(message, sendMessage) });
  }
})


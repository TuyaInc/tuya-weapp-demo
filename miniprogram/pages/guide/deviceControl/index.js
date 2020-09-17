// pages/guide/deviceControl/index.js
import { getDeviceList } from '../../../utils/api/device-api'
import { gotoApNetwork, gotoVirtualNetwork } from '../../../utils/api/common-api'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    errText: '',
    deviceList: []
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: async function () {
    const deviceList = await getDeviceList()
    if(Array.isArray(deviceList) && deviceList.length !== 0) {
      this.setData({ deviceList })
    } else {
      this.setData({ errText: '当前用户下无设备，请配网后再进行体验' })
    }
  },

  /**
   * 跳转ap配网
   */
  gotoApNetwork: gotoApNetwork,

  /**
   * 跳转扫码配网(虚拟设备)
   */
  gotoVirtualNetwork: gotoVirtualNetwork,

  turnDeviceOn: function (event) {
    const { currentTarget: { dataset } } = event
    const { devid, name } = dataset
    wx.navigateTo({
      url: `/pages/deviceDisplay/index?devid=${devid}&name=${name}`,
    })
  }
})
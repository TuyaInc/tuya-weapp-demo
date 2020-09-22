// pages/guide/network/index.js
import { gotoApNetwork, gotoVirtualNetwork } from '../../../utils/api/common-api'

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 插件文档链接
   */
  onCopy: function () {
    wx.setClipboardData({
      data: 'https://mp.weixin.qq.com/wxopen/plugindevdoc?appid=wxd2aa51ffacc3ff86&token=1662994465&lang=zh_CN',
    })
  },
  onJump: function () {
    wx.miniProgram.navigateTo({ url: 'https://developer.tuya.com/cn/docs/iot/app-development/mini-programs/tuya-applet-with-web-plugin/distribution-network-plugin?id=K9lq218xn0wn8' })
  },

  /**
   * 跳转ap配网
   */
  gotoApNetwork: gotoApNetwork,

  /**
   * 跳转扫码配网(虚拟设备)
   */
  gotoVirtualNetwork: gotoVirtualNetwork,
})
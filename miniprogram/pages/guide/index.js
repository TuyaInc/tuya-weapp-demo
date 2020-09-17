// pages/guide/index.js

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  gotoHomePage: function () {
    wx.reLaunch({
      url: '/pages/home/index',
    })
  },

  gotoFamily: function () {
    wx.reLaunch({
      url: '/pages/family/familyList/index',
    })
  },

  goNetworkPage: function () {
    wx.navigateTo({
      url: '/pages/guide/network/index',
    })
  },

  goDeviceControlPage: function () {
    wx.navigateTo({
      url: '/pages/guide/deviceControl/index',
    })
  },
})
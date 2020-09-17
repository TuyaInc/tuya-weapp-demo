// pages/family/index.js
import { getFamilyList } from '../../../utils/api/family-api'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    familyList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: async function () {
    const familyList = await getFamilyList()
    if(Array.isArray(familyList) && familyList.length > 0) this.setData({ familyList });
  },

  turnFamilycontrolPage: function(event) {
    const { currentTarget: { dataset } } = event
    const { homeid } = dataset

    wx.navigateTo({
      url: `/pages/family/familyControl/index?homeid=${homeid}`,
    })
  },

  turnAddfamilyPage: function () {
    wx.navigateTo({
      url: `/pages/family/addFamily/index`,
    })
  }
})
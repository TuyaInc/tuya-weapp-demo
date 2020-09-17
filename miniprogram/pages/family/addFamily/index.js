// miniprogram/pages/family/addFamily/index.js
import { addFamily } from  '../../../utils/api/family-api'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    homeName: ''
  },

  onInput: function (e) {
    const { value } = e.detail
    console.log(value)
    this.setData({ homeName: value })
  },

  onAddFamily: async function () {
    const { homeName } = this.data
    const uid = wx.getStorageSync('uid')
    if(homeName.length !== 0) {
      const { result: success } = await addFamily(homeName, uid);
      if (success) {
        wx.navigateBack({
          delta: 1
        });
      }
    } else {
      wx.showToast({
        title: '家庭名称不能为空',
        icon: 'none',
        duration: 3000
      });
    }
  }
})